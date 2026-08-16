from uuid import UUID

from pydantic import BaseModel


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str | None = None
    category_id: UUID


class ProductOut(BaseModel):
    id: UUID
    vendor_id: UUID
    name: str
    slug: str
    description: str | None
    category_id: UUID
    is_active: bool

    model_config = {
        "from_attributes": True,
    }