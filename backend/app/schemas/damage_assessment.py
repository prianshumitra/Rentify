from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class DamageSeverity(str, Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class DamageAssessmentCreate(BaseModel):
    severity: DamageSeverity
    description: str = Field(min_length=1)
    estimated_charge: Decimal = Field(ge=0)