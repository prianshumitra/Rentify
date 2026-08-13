from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
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
    db: Session = Depends(get_db),
):
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