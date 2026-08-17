from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.rental import Rental
from app.models.user import User
from app.services.rental_return import return_rental


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Returns"],
)


@router.post(
    "/{rental_id}/return",
    status_code=status.HTTP_200_OK,
)
def return_rental_endpoint(
    rental_id: UUID,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rental = db.get(Rental, rental_id)

    if rental is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rental not found.",
        )

    if not current_user.is_admin and rental.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to return this rental.",
        )

    try:
        rental = return_rental(
            db=db,
            rental_id=rental_id,
        )

        return {
            "id": rental.id,
            "status": rental.status,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )