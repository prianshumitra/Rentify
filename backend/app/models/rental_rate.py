from decimal import Decimal
from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, Numeric
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class RentalPeriod(str, Enum):
    HOURLY = "hourly"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"


class RentalRate(Base):
    __tablename__ = "rental_rates"

    price_list_id: Mapped[UUID] = mapped_column(
        ForeignKey("price_lists.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    variant_id: Mapped[UUID] = mapped_column(
        ForeignKey("product_variants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    period: Mapped[RentalPeriod] = mapped_column(
        SQLEnum(RentalPeriod),
        nullable=False,
    )

    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 2),
        nullable=False,
    )