from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.services.availability import get_available_inventory


router = APIRouter(
    prefix="/api/v1/availability",
    tags=["Availability"],
)


@router.get("/{variant_id}")
def check_availability(
    variant_id: UUID,
    start_at: datetime = Query(...),
    end_at: datetime = Query(...),
    db: Session = Depends(get_db),
):
    available_items = get_available_inventory(
        db=db,
        variant_id=variant_id,
        start_at=start_at,
        end_at=end_at,
    )

    return {
        "variant_id": variant_id,
        "start_at": start_at,
        "end_at": end_at,
        "available_quantity": len(available_items),
        "inventory_items": [
            {
                "id": item.id,
                "asset_code": item.asset_code,
                "status": item.status,
            }
            for item in available_items
        ],
    }