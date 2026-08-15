from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.rental import Rental
from app.services.stripe import create_payment_intent, create_refund


def create_payment(
    db: Session,
    rental_id: UUID,
    payment_type: PaymentType,
    amount: Decimal,
) -> Payment:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if amount <= 0:
        raise ValueError("Payment amount must be greater than 0.")

    # Stripe expects the amount in the smallest currency unit.
    # ₹2500 → 250000 paise
    amount_in_paise = int(amount * 100)

    payment_intent = create_payment_intent(
        amount=amount_in_paise,
        currency="inr",
    )

    payment = Payment(
        rental_id=rental_id,
        payment_type=payment_type,
        amount=amount,
        status=PaymentStatus.PENDING,
        stripe_payment_id=payment_intent.id,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def refund_payment(
    db: Session,
    rental_id: UUID,
) -> Payment:

    payment = (
        db.query(Payment)
        .filter(
            Payment.rental_id == rental_id,
            Payment.payment_type == PaymentType.RENTAL,
            Payment.status == PaymentStatus.PAID,
        )
        .first()
    )

    if payment is None:
        raise ValueError("No paid rental payment found.")

    if not payment.stripe_payment_id:
        raise ValueError("Payment does not have a Stripe payment ID.")

    create_refund(payment.stripe_payment_id)

    payment.status = PaymentStatus.REFUNDED

    db.commit()
    db.refresh(payment)

    return payment