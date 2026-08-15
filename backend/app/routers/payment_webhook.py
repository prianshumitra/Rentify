import stripe

from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.payment import Payment, PaymentStatus


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
    signature = request.headers.get("stripe-signature")

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

        print(
            "STRIPE PAYMENT INTENT:",
            payment_intent["id"],
        )

        payment = (
            db.query(Payment)
            .filter(
                Payment.stripe_payment_id == payment_intent["id"]
            )
            .first()
        )

        print(
            "RENTIFY PAYMENT FOUND:",
            payment.id if payment else None,
        )

        if payment:
            payment.status = PaymentStatus.PAID
            db.commit()

    return {"status": "success"}