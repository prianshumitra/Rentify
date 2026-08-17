import stripe

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.payment import Payment, PaymentStatus, PaymentType
from app.models.rental import Rental, RentalStatus


router = APIRouter(
    prefix="/api/v1/payments",
    tags=["Payment Webhook"],
)


@router.post("/webhook")
async def stripe_webhook(
    request: Request,
    db: Session = Depends(get_db),
):
    payload = await request.body()

    signature = request.headers.get(
        "stripe-signature"
    )

    if not signature:
        raise HTTPException(
            status_code=400,
            detail="Missing Stripe signature.",
        )

    try:
        event = stripe.Webhook.construct_event(
            payload,
            signature,
            settings.STRIPE_WEBHOOK_SECRET,
        )

    except ValueError:
        raise HTTPException(
            status_code=400,
            detail="Invalid payload.",
        )

    except stripe.error.SignatureVerificationError:
        raise HTTPException(
            status_code=400,
            detail="Invalid Stripe signature.",
        )

    if event["type"] == "payment_intent.succeeded":

        payment_intent = event["data"]["object"]

        payment = (
            db.query(Payment)
            .filter(
                Payment.stripe_payment_id
                == payment_intent["id"]
            )
            .first()
        )

        if payment is None:
            return {"status": "success"}

        payment.status = PaymentStatus.PAID

        if payment.payment_type == PaymentType.RENTAL:

            rental = db.get(
                Rental,
                payment.rental_id,
            )

            if rental is not None:

                if (
                    rental.status
                    == RentalStatus.PENDING_PAYMENT
                ):
                    rental.status = (
                        RentalStatus.CONFIRMED
                    )

        db.commit()

    return {"status": "success"}