from fastapi import FastAPI
from app.routers.rental import router as rental_router
from app.routers.availability import router as availability_router

app = FastAPI(
    title="Rentify API",
)

app.include_router(availability_router)
app.include_router(rental_router)