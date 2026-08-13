from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.rental import RentalStatus
from app.services.rental_lifecycle import transition_rental


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Rental Lifecycle"],
)


@router.patch("/{rental_id}/status")
def update_rental_status(
    rental_id: UUID,
    new_status: RentalStatus,
    db: Session = Depends(get_db),
):
    try:
        rental = transition_rental(
            db=db,
            rental_id=rental_id,
            new_status=new_status,
        )

        return {
            "id": rental.id,
            "status": rental.status,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc),
        )