from uuid import UUID

from sqlalchemy.orm import Session

from app.models.rental import Rental, RentalStatus
from app.models.return_inspection import (
    InspectionCondition,
    ReturnInspection,
)


def create_return_inspection(
    db: Session,
    rental_id: UUID,
    condition: InspectionCondition,
    notes: str | None = None,
) -> ReturnInspection:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if rental.status != RentalStatus.RETURNED:
        raise ValueError(
            "Rental must be returned before it can be inspected."
        )

    existing_inspection = (
        db.query(ReturnInspection)
        .filter(ReturnInspection.rental_id == rental_id)
        .first()
    )

    if existing_inspection:
        raise ValueError(
            "Return inspection already exists for this rental."
        )

    inspection = ReturnInspection(
        rental_id=rental_id,
        condition=condition,
        notes=notes,
    )

    db.add(inspection)
    db.commit()
    db.refresh(inspection)

    return inspection