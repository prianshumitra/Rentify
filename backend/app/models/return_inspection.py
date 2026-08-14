from datetime import datetime
from enum import Enum
from uuid import UUID

from sqlalchemy import DateTime, Enum as SQLEnum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime, timezone
from app.db.base import Base


class InspectionCondition(str, Enum):
    GOOD = "good"
    DAMAGED = "damaged"


class ReturnInspection(Base):
    __tablename__ = "return_inspections"

    rental_id: Mapped[UUID] = mapped_column(
        ForeignKey("rentals.id", ondelete="CASCADE"),
        nullable=False,
        unique=True,
        index=True,
    )

    condition: Mapped[InspectionCondition] = mapped_column(
        SQLEnum(InspectionCondition),
        nullable=False,
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    inspected_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )