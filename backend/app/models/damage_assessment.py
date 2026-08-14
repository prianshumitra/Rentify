from datetime import datetime, timezone
from decimal import Decimal
from enum import Enum
from uuid import UUID

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class DamageSeverity(str, Enum):
    MINOR = "minor"
    MODERATE = "moderate"
    SEVERE = "severe"


class DamageAssessment(Base):
    __tablename__ = "damage_assessments"

    rental_id: Mapped[UUID] = mapped_column(
        ForeignKey("rentals.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    severity: Mapped[DamageSeverity] = mapped_column(
        SQLEnum(DamageSeverity),
        nullable=False,
    )

    description: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    estimated_charge: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
        default=0,
    )

    assessed_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )