from datetime import datetime
from decimal import Decimal
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.inventory import InventoryItem, InventoryStatus
from app.models.inventory_allocation import InventoryAllocation
from app.models.rental import Rental, RentalStatus
from app.models.rental_item import RentalItem


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
        raise ValueError("Rental end time must be after start time.")

    if quantity < 1:
        raise ValueError("Quantity must be at least 1.")

    # Find inventory items that are not already allocated
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
        raise ValueError("Not enough inventory available for the requested period.")

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