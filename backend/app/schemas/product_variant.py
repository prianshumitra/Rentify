from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class ProductVariantCreate(BaseModel):
    sku: str
    brand: str | None = None
    manufacturer: str | None = None
    color: str | None = None
    size: str | None = None
    unit_price: Decimal = Field(gt=0)


class ProductVariantUpdate(BaseModel):
    sku: str | None = None
    brand: str | None = None
    manufacturer: str | None = None
    color: str | None = None
    size: str | None = None
    unit_price: Decimal | None = Field(default=None, gt=0)
    is_active: bool | None = None


class ProductVariantOut(BaseModel):
    id: UUID
    product_id: UUID
    sku: str
    brand: str | None
    manufacturer: str | None
    color: str | None
    size: str | None
    unit_price: Decimal
    is_active: bool

    model_config = {
        "from_attributes": True,
    }