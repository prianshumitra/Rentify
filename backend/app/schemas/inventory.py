from uuid import UUID

from pydantic import BaseModel

from app.models.inventory import InventoryStatus


class InventoryItemCreate(BaseModel):
    asset_code: str
    serial_number: str | None = None


class InventoryItemUpdate(BaseModel):
    asset_code: str | None = None
    serial_number: str | None = None
    status: InventoryStatus | None = None


class InventoryItemOut(BaseModel):
    id: UUID
    variant_id: UUID
    asset_code: str
    serial_number: str | None
    status: InventoryStatus

    model_config = {
        "from_attributes": True,
    }