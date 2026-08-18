from datetime import datetime, timezone
from decimal import Decimal
from math import ceil
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.inventory import InventoryItem, InventoryStatus
from app.models.inventory_allocation import InventoryAllocation
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.product import Product
from app.models.product_variant import ProductVariant
from app.models.rental import Rental, RentalStatus
from app.models.rental_item import RentalItem
from app.models.user import User
from app.services.payment import refund_payment


def create_rental(
    db: Session,
    user_id: UUID,
    variant_id: UUID,
    start_at: datetime,
    end_at: datetime,
    unit_price: Decimal | None = None,
    quantity: int = 1,
) -> Rental:

    if start_at >= end_at:
        raise ValueError(
            "Rental end time must be after start time."
        )

    if quantity < 1:
        raise ValueError(
            "Quantity must be at least 1."
        )

    # Find the product variant.
    variant = db.get(ProductVariant, variant_id)

    if variant is None:
        raise ValueError(
            "Product variant not found."
        )

    if not variant.is_active:
        raise ValueError(
            "Product variant is inactive."
        )

    # Use variant.unit_price for security, ignoring input unit_price if provided
    actual_unit_price = variant.unit_price

    if actual_unit_price <= 0:
        raise ValueError(
            "This variant does not have a valid rental price."
        )

    # Find the product that owns the variant.
    product = db.get(Product, variant.product_id)

    if product is None:
        raise ValueError(
            "Product not found."
        )

    if not product.is_active:
        raise ValueError(
            "Product is inactive."
        )

    # Vendors can rent other vendors' products,
    # but cannot rent their own products.
    if product.vendor_id == user_id:
        raise ValueError(
            "Vendors cannot rent their own products."
        )

    # Find inventory items that are not already
    # allocated during the requested rental period.
    allocated_items = select(
        InventoryAllocation.inventory_item_id
    ).where(
        InventoryAllocation.start_at < end_at,
        InventoryAllocation.end_at > start_at,
    )

    available_items = list(
        db.scalars(
            select(InventoryItem)
            .where(
                InventoryItem.variant_id == variant_id,
                InventoryItem.status == InventoryStatus.AVAILABLE,
                InventoryItem.id.not_in(allocated_items),
            )
            .limit(quantity)
        ).all()
    )

    if len(available_items) < quantity:
        raise ValueError(
            "Not enough inventory available for the requested period."
        )

    subtotal = actual_unit_price * quantity

    rental = Rental(
        user_id=user_id,
        start_at=start_at,
        end_at=end_at,
        status=RentalStatus.PENDING_PAYMENT,
        rental_amount=subtotal,
        deposit_amount=Decimal("0.00"),
        total_amount=subtotal,
    )

    db.add(rental)
    db.flush()

    rental_item = RentalItem(
        rental_id=rental.id,
        variant_id=variant_id,
        quantity=quantity,
        unit_price=actual_unit_price,
        subtotal=subtotal,
    )

    db.add(rental_item)

    for inventory_item in available_items:
        allocation = InventoryAllocation(
            inventory_item_id=inventory_item.id,
            rental_id=rental.id,
            start_at=start_at,
            end_at=end_at,
        )

        db.add(allocation)

    db.commit()
    db.refresh(rental)

    return rental


def cancel_rental(
    db: Session,
    rental_id: UUID,
) -> Rental:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError(
            "Rental not found."
        )

    cancellable_statuses = {
        RentalStatus.CONFIRMED,
        RentalStatus.READY_FOR_PICKUP,
    }

    if rental.status not in cancellable_statuses:
        raise ValueError(
            f"Rental cannot be cancelled from "
            f"{rental.status.value} status."
        )

    # Check for a paid rental payment.
    paid_payment = (
        db.query(Payment)
        .filter(
            Payment.rental_id == rental_id,
            Payment.payment_type == PaymentType.RENTAL,
            Payment.status == PaymentStatus.PAID,
        )
        .first()
    )

    # Refund if the rental has already been paid.
    if paid_payment:
        refund_payment(
            db=db,
            rental_id=rental_id,
        )

    # Release inventory allocations.
    allocations = db.scalars(
        select(InventoryAllocation).where(
            InventoryAllocation.rental_id == rental_id
        )
    ).all()

    for allocation in allocations:
        db.delete(allocation)

    rental.status = RentalStatus.CANCELLED

    db.commit()
    db.refresh(rental)

    return rental


def mark_overdue_rentals(
    db: Session,
) -> list[Rental]:

    now = datetime.now(timezone.utc)

    overdue_rentals = db.scalars(
        select(Rental).where(
            Rental.status == RentalStatus.ACTIVE,
            Rental.end_at < now,
        )
    ).all()

    for rental in overdue_rentals:
        rental.status = RentalStatus.OVERDUE

    db.commit()

    return overdue_rentals


def calculate_late_fee(
    rental: Rental,
) -> Decimal:

    if rental.status != RentalStatus.OVERDUE:
        raise ValueError(
            "Late fee can only be calculated for overdue rentals."
        )

    now = datetime.now(timezone.utc)

    overdue_duration = now - rental.end_at

    overdue_hours = (
        overdue_duration.total_seconds() / 3600
    )

    late_periods = ceil(overdue_hours / 24)

    late_fee = (
        rental.rental_amount
        * Decimal("0.10")
        * late_periods
    )

    return late_fee.quantize(
        Decimal("0.01")
    )


def list_user_rentals(
    db: Session,
    user: User,
) -> list[dict]:
    query = select(Rental)
    if not user.is_admin:
        query = query.where(Rental.user_id == user.id)

    rentals = db.scalars(query.order_by(Rental.created_at.desc())).all()

    result = []
    for r in rentals:
        items = db.scalars(select(RentalItem).where(RentalItem.rental_id == r.id)).all()
        item_details = []
        for item in items:
            variant = db.get(ProductVariant, item.variant_id)
            product = db.get(Product, variant.product_id) if variant else None
            item_details.append({
                "id": item.id,
                "variant_id": item.variant_id,
                "quantity": item.quantity,
                "unit_price": item.unit_price,
                "subtotal": item.subtotal,
                "product_name": product.name if product else "Unknown Product",
                "variant_sku": variant.sku if variant else "",
                "variant_brand": variant.brand if variant else "",
                "variant_color": variant.color if variant else "",
                "variant_size": variant.size if variant else "",
            })

        result.append({
            "id": r.id,
            "user_id": r.user_id,
            "start_at": r.start_at,
            "end_at": r.end_at,
            "status": r.status,
            "rental_amount": r.rental_amount,
            "deposit_amount": r.deposit_amount,
            "total_amount": r.total_amount,
            "created_at": r.created_at,
            "items": item_details,
        })
    return result


def get_rental_detail(
    db: Session,
    rental_id: UUID,
    user: User,
) -> dict:
    rental = db.get(Rental, rental_id)
    if rental is None:
        raise ValueError("Rental not found.")

    if not user.is_admin and rental.user_id != user.id:
        items = db.scalars(select(RentalItem).where(RentalItem.rental_id == rental_id)).all()
        vendor_owns = False
        for item in items:
            variant = db.get(ProductVariant, item.variant_id)
            if variant:
                product = db.get(Product, variant.product_id)
                if product and product.vendor_id == user.id:
                    vendor_owns = True
                    break
        if not vendor_owns:
            raise ValueError("You do not have permission to view this rental.")

    items = db.scalars(select(RentalItem).where(RentalItem.rental_id == rental_id)).all()
    item_details = []
    for item in items:
        variant = db.get(ProductVariant, item.variant_id)
        product = db.get(Product, variant.product_id) if variant else None
        item_details.append({
            "id": item.id,
            "variant_id": item.variant_id,
            "quantity": item.quantity,
            "unit_price": item.unit_price,
            "subtotal": item.subtotal,
            "product_name": product.name if product else "Unknown Product",
            "product_id": product.id if product else None,
            "variant_sku": variant.sku if variant else "",
            "variant_brand": variant.brand if variant else "",
            "variant_color": variant.color if variant else "",
            "variant_size": variant.size if variant else "",
        })

    payments = db.scalars(select(Payment).where(Payment.rental_id == rental_id)).all()
    payment_details = [
        {
            "id": p.id,
            "payment_type": p.payment_type,
            "status": p.status,
            "amount": p.amount,
            "stripe_payment_id": p.stripe_payment_id,
        }
        for p in payments
    ]

    return {
        "id": rental.id,
        "user_id": rental.user_id,
        "start_at": rental.start_at,
        "end_at": rental.end_at,
        "status": rental.status,
        "rental_amount": rental.rental_amount,
        "deposit_amount": rental.deposit_amount,
        "total_amount": rental.total_amount,
        "created_at": rental.created_at,
        "items": item_details,
        "payments": payment_details,
    }