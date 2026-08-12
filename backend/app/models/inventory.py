from enum import Enum
from uuid import UUID

from sqlalchemy import Enum as SQLEnum
from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class InventoryStatus(str, Enum):
    AVAILABLE = "available"
    RENTED = "rented"
    RESERVED = "reserved"
    MAINTENANCE = "maintenance"
    LOST = "lost"
    RETIRED = "retired"


class InventoryItem(Base):
    __tablename__ = "inventory_items"

    variant_id: Mapped[UUID] = mapped_column(
        ForeignKey("product_variants.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    asset_code: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
        unique=True,
        index=True,
    )

    serial_number: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True,
        unique=True,
    )

    status: Mapped[InventoryStatus] = mapped_column(
        SQLEnum(InventoryStatus),
        nullable=False,
        default=InventoryStatus.AVAILABLE,
        index=True,
    )