from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.return_inspection import ReturnInspectionCreate
from app.services.return_inspection import create_return_inspection


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Return Inspection"],
)


@router.post(
    "/{rental_id}/inspection",
    status_code=status.HTTP_201_CREATED,
)
def create_return_inspection_endpoint(
    rental_id: UUID,
    inspection_data: ReturnInspectionCreate,
    db: Session = Depends(get_db),
):
    try:
        inspection = create_return_inspection(
            db=db,
            rental_id=rental_id,
            condition=inspection_data.condition,
            notes=inspection_data.notes,
        )

        return {
            "id": inspection.id,
            "rental_id": inspection.rental_id,
            "condition": inspection.condition,
            "notes": inspection.notes,
            "inspected_at": inspection.inspected_at,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )