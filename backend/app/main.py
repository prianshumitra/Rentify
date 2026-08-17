from fastapi import FastAPI

from app.routers.availability import router as availability_router
from app.routers.damage_assessment import router as damage_assessment_router
from app.routers.payment import router as payment_router
from app.routers.payment_webhook import router as payment_webhook_router
from app.routers.product import router as product_router
from app.routers.rental import router as rental_router
from app.routers.rental_lifecycle import router as rental_lifecycle_router
from app.routers.rental_return import router as rental_return_router
from app.routers.return_inspection import router as return_inspection_router
from app.routers.user import router as user_router
from app.routers.product_variant import router as product_variant_router


app = FastAPI(
    title="Rentify API",
)


app.include_router(availability_router)
app.include_router(rental_router)
app.include_router(rental_lifecycle_router)
app.include_router(rental_return_router)
app.include_router(return_inspection_router)
app.include_router(damage_assessment_router)
app.include_router(payment_router)
app.include_router(payment_webhook_router)
app.include_router(user_router)
app.include_router(product_router)
app.include_router(product_variant_router)