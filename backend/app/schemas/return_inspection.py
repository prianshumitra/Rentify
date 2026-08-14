from enum import Enum

from pydantic import BaseModel


class InspectionCondition(str, Enum):
    GOOD = "good"
    DAMAGED = "damaged"


class ReturnInspectionCreate(BaseModel):
    condition: InspectionCondition
    notes: str | None = None