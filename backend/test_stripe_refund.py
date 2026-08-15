from app.services.stripe import create_refund


payment_intent_id = "pi_3U4lnO5qWhjb0Q2z0t8JUYe7"

refund = create_refund(payment_intent_id)

print("Refund ID:", refund.id)
print("Refund Status:", refund.status)