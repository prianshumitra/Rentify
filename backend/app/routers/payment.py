from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.payment import PaymentCreate
from app.services.payment import create_payment


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Payments"],
)


@router.post(
    "/{rental_id}/payments",
    status_code=status.HTTP_201_CREATED,
)
def create_payment_endpoint(
    rental_id: UUID,
    payment_data: PaymentCreate,
    db: Session = Depends(get_db),
):
    try:
        payment = create_payment(
            db=db,
            rental_id=rental_id,
            payment_type=payment_data.payment_type,
            amount=payment_data.amount,
        )

        return {
            "id": payment.id,
            "rental_id": payment.rental_id,
            "payment_type": payment.payment_type,
            "status": payment.status,
            "amount": payment.amount,
            "stripe_payment_id": payment.stripe_payment_id,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )