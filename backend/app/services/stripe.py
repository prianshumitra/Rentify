from stripe import StripeClient

from app.core.config import settings


stripe_client = StripeClient(settings.STRIPE_SECRET_KEY)


def create_payment_intent(amount: int, currency: str = "inr"):
    payment_intent = stripe_client.v1.payment_intents.create(
        {
            "amount": amount,
            "currency": currency,
            "payment_method_types": ["card"],
        }
    )

    return payment_intent