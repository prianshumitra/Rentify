from datetime import datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.inventory import InventoryItem, InventoryStatus
from app.models.inventory_allocation import InventoryAllocation


def get_available_inventory(
    db: Session,
    variant_id: UUID,
    start_at: datetime,
    end_at: datetime,
) -> list[InventoryItem]:

    allocated_items = select(
        InventoryAllocation.inventory_item_id
    ).where(
        InventoryAllocation.start_at < end_at,
        InventoryAllocation.end_at > start_at,
    )

    statement = (
        select(InventoryItem)
        .where(
            InventoryItem.variant_id == variant_id,
            InventoryItem.status == InventoryStatus.AVAILABLE,
            InventoryItem.id.not_in(allocated_items),
        )
    )

    return list(db.scalars(statement).all())