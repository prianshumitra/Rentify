import stripe

from app.core.config import settings

stripe_client = stripe.StripeClient(settings.STRIPE_SECRET_KEY)

payment_intent_id = "pi_3U4lnO5qWhjb0Q2z0t8JUYe7"

payment_intent = stripe_client.payment_intents.confirm(
    payment_intent_id,
    {
        "payment_method": "pm_card_visa",
    },
)

print("PaymentIntent:", payment_intent.id)
print("Status:", payment_intent.status)