from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.rental import Rental


def create_payment(
    db: Session,
    rental_id: UUID,
    payment_type: PaymentType,
    amount,
) -> Payment:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if amount <= 0:
        raise ValueError("Payment amount must be greater than 0.")

    payment = Payment(
        rental_id=rental_id,
        payment_type=payment_type,
        amount=amount,
        status=PaymentStatus.PENDING,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment