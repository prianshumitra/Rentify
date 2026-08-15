from decimal import Decimal
from enum import Enum

from pydantic import BaseModel, Field


class PaymentType(str, Enum):
    RENTAL = "rental"
    DEPOSIT = "deposit"
    DAMAGE_CHARGE = "damage_charge"
    REFUND = "refund"


class PaymentCreate(BaseModel):
    payment_type: PaymentType
    amount: Decimal = Field(gt=0)