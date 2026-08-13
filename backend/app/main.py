from fastapi import FastAPI
from app.routers.rental import router as rental_router
from app.routers.availability import router as availability_router
from app.routers.rental_lifecycle import router as rental_lifecycle_router
from app.routers.rental_return import router as rental_return_router

app = FastAPI(
    title="Rentify API",
)

app.include_router(availability_router)
app.include_router(rental_router)
app.include_router(rental_lifecycle_router)
app.include_router(rental_return_router)