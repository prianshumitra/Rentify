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

def create_refund(payment_intent_id: str):
    refund = stripe_client.v1.refunds.create(
        {
            "payment_intent": payment_intent_id,
        }
    )

    return refund

def get_payment_intent(payment_intent_id: str):
    payment_intent = stripe_client.v1.payment_intents.retrieve(payment_intent_id)
    return payment_intent