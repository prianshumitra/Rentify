from stripe import StripeClient

from app.core.config import settings


stripe_client = StripeClient(settings.STRIPE_SECRET_KEY)


def create_payment_intent(amount: int, currency: str = "inr"):
    payment_intent = stripe_client.payment_intents.create(
        {
            "amount": amount,
            "currency": currency,
            "automatic_payment_methods": {
                "enabled": True,
            },
        }
    )

    return payment_intent