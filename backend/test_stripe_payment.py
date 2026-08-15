import stripe

from app.core.config import settings

stripe_client = stripe.StripeClient(settings.STRIPE_SECRET_KEY)

payment_intent_id = "pi_3U4pEm5qWhjb0Q2z14HaLBM2"

payment_intent = stripe_client.payment_intents.confirm(
    payment_intent_id,
    {
        "payment_method": "pm_card_visa",
    },
)

print("PaymentIntent:", payment_intent.id)
print("Status:", payment_intent.status)