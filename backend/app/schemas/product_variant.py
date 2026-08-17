from uuid import UUID

from pydantic import BaseModel


class ProductVariantCreate(BaseModel):
    sku: str
    brand: str | None = None
    manufacturer: str | None = None
    color: str | None = None
    size: str | None = None


class ProductVariantUpdate(BaseModel):
    sku: str | None = None
    brand: str | None = None
    manufacturer: str | None = None
    color: str | None = None
    size: str | None = None
    is_active: bool | None = None


class ProductVariantOut(BaseModel):
    id: UUID
    product_id: UUID
    sku: str
    brand: str | None
    manufacturer: str | None
    color: str | None
    size: str | None
    is_active: bool

    model_config = {
        "from_attributes": True,
    }