from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.rental import RentalCreate
from app.services.rental import create_rental


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Rentals"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_rental_endpoint(
    rental_data: RentalCreate,
    db: Session = Depends(get_db),
):
    # Temporary user ID for testing.
    # We'll replace this with the authenticated user's ID later.
    user_id = UUID("681e0146-7550-4fc4-a6df-938dc7be2e9c")

    try:
        rental = create_rental(
            db=db,
            user_id=user_id,
            variant_id=rental_data.variant_id,
            start_at=rental_data.start_at,
            end_at=rental_data.end_at,
            unit_price=rental_data.unit_price,
            quantity=rental_data.quantity,
        )

        return {
            "id": rental.id,
            "status": rental.status,
            "start_at": rental.start_at,
            "end_at": rental.end_at,
            "rental_amount": rental.rental_amount,
            "deposit_amount": rental.deposit_amount,
            "total_amount": rental.total_amount,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )