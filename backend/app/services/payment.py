from decimal import Decimal
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.rental import Rental, RentalStatus
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


def create_late_fee_payment(
    db: Session,
    rental_id: UUID,
) -> Payment:

    # Local import avoids circular import:
    # rental.py → payment.py → rental.py
    from app.services.rental import calculate_late_fee

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if rental.status != RentalStatus.OVERDUE:
        raise ValueError(
            "Late fee can only be created for overdue rentals."
        )

    existing_payment = (
        db.query(Payment)
        .filter(
            Payment.rental_id == rental_id,
            Payment.payment_type == PaymentType.LATE_FEE,
        )
        .first()
    )

    if existing_payment:
        raise ValueError(
            "Late fee payment already exists for this rental."
        )

    late_fee = calculate_late_fee(rental)

    if late_fee <= 0:
        raise ValueError("Late fee must be greater than 0.")

    payment = Payment(
        rental_id=rental_id,
        payment_type=PaymentType.LATE_FEE,
        amount=late_fee,
        status=PaymentStatus.PENDING,
        stripe_payment_id=None,
    )

    db.add(payment)
    db.commit()
    db.refresh(payment)

    return payment


def pay_late_fee(
    db: Session,
    payment_id: UUID,
) -> Payment:

    payment = db.get(Payment, payment_id)

    if payment is None:
        raise ValueError("Payment not found.")

    if payment.payment_type != PaymentType.LATE_FEE:
        raise ValueError("Payment is not a late-fee payment.")

    if payment.status != PaymentStatus.PENDING:
        raise ValueError("Late-fee payment is not pending.")

    amount_in_paise = int(payment.amount * 100)

    payment_intent = create_payment_intent(
        amount=amount_in_paise,
        currency="inr",
    )

    payment.stripe_payment_id = payment_intent.id

    db.commit()
    db.refresh(payment)

    return payment