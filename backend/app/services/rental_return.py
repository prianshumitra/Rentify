from datetime import datetime, timezone
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.rental import Rental, RentalStatus
from app.models.inventory_allocation import InventoryAllocation


def return_rental(
    db: Session,
    rental_id: UUID,
) -> Rental:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if rental.status != RentalStatus.RETURN_PENDING:
        raise ValueError(
            "Rental must be in return_pending status."
        )

    returned_at = datetime.now(timezone.utc)

    allocations = db.scalars(
        select(InventoryAllocation).where(
            InventoryAllocation.rental_id == rental_id
        )
    ).all()

    if not allocations:
        raise ValueError(
            "No inventory allocation found for this rental."
        )

    # Release the allocated inventory at the actual return time.
    for allocation in allocations:
        allocation.end_at = returned_at

    rental.status = RentalStatus.RETURNED

    db.commit()
    db.refresh(rental)

    return rental