from uuid import UUID
from app.models.rental import Rental

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.models.user import User

from app.db.session import get_db
from app.schemas.rental import RentalCreate
from app.services.rental import (
    create_rental, cancel_rental, mark_overdue_rentals, calculate_late_fee,
    )


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Rentals"],
)


@router.post("/", status_code=status.HTTP_201_CREATED)
def create_rental_endpoint(
    rental_data: RentalCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    user_id = current_user.id
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


@router.post("/{rental_id}/cancel")
def cancel_rental_endpoint(
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
            detail="You do not have permission to cancel this rental.",
        )

    try:
        rental = cancel_rental(
            db=db,
            rental_id=rental_id,
        )

        return {
            "id": rental.id,
            "status": rental.status,
            "start_at": rental.start_at,
            "end_at": rental.end_at,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )


@router.post("/mark-overdue")
def mark_overdue_rentals_endpoint(
    db: Session = Depends(get_db),
):
    overdue_rentals = mark_overdue_rentals(db=db)

    return {
        "message": "Overdue rentals processed successfully.",
        "count": len(overdue_rentals),
        "rentals": [
            {
                "id": rental.id,
                "status": rental.status,
                "end_at": rental.end_at,
            }
            for rental in overdue_rentals
        ],
    }

@router.get("/{rental_id}/late-fee")
def calculate_late_fee_endpoint(
    rental_id: UUID,
    db: Session = Depends(get_db),
):
    rental = db.get(Rental, rental_id)

    if rental is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rental not found.",
        )

    try:
        late_fee = calculate_late_fee(rental)

        return {
            "rental_id": rental.id,
            "rental_amount": rental.rental_amount,
            "late_fee": late_fee,
            "status": rental.status,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )