from datetime import datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field


class RentalCreate(BaseModel):
    variant_id: UUID
    start_at: datetime
    end_at: datetime
    unit_price: Decimal = Field(gt=0)
    quantity: int = Field(default=1, ge=1)