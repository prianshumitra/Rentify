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
from app.services.payment import refund_payment


def create_rental(
    db: Session,
    user_id: UUID,
    variant_id: UUID,
    start_at: datetime,
    end_at: datetime,
    unit_price: Decimal,
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

    # Find the variant and its parent product.
    variant = db.get(ProductVariant, variant_id)

    if variant is None:
        raise ValueError(
            "Product variant not found."
        )

    if not variant.is_active:
        raise ValueError(
            "Product variant is inactive."
        )

    product = db.get(Product, variant.product_id)

    if product is None:
        raise ValueError(
            "Product not found."
        )

    if not product.is_active:
        raise ValueError(
            "Product is inactive."
        )

    # A vendor can rent other vendors' products,
    # but cannot rent their own products.
    if product.vendor_id == user_id:
        raise ValueError(
            "Vendors cannot rent their own products."
        )

    # Find inventory items that are not already allocated.
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

    subtotal = unit_price * quantity

    rental = Rental(
        user_id=user_id,
        start_at=start_at,
        end_at=end_at,
        status=RentalStatus.CONFIRMED,
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
        unit_price=unit_price,
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
        raise ValueError("Rental not found.")

    cancellable_statuses = {
        RentalStatus.CONFIRMED,
        RentalStatus.READY_FOR_PICKUP,
    }

    if rental.status not in cancellable_statuses:
        raise ValueError(
            f"Rental cannot be cancelled from "
            f"{rental.status.value} status."
        )

    paid_payment = (
        db.query(Payment)
        .filter(
            Payment.rental_id == rental_id,
            Payment.payment_type == PaymentType.RENTAL,
            Payment.status == PaymentStatus.PAID,
        )
        .first()
    )

    if paid_payment:
        refund_payment(
            db=db,
            rental_id=rental_id,
        )

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

    overdue_hours = overdue_duration.total_seconds() / 3600

    late_periods = ceil(overdue_hours / 24)

    late_fee = (
        rental.rental_amount
        * Decimal("0.10")
        * late_periods
    )

    return late_fee.quantize(Decimal("0.01"))