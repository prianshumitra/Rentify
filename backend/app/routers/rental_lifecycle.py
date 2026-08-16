from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.rental_lifecycle import transition_rental
from app.core.security import get_current_user
from app.models.user import User
from app.models.rental import Rental, RentalStatus


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Rental Lifecycle"],
)


@router.patch("/{rental_id}/status")
def update_rental_status(
    rental_id: UUID,
    new_status: RentalStatus,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rental = db.get(Rental, rental_id)

    if rental is None:
        raise HTTPException(
            status_code=404,
            detail="Rental not found.",
        )
    if not current_user.is_admin and rental.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You do not have permission to manage this rental.",
        )

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