from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import get_current_user
from app.db.session import get_db
from app.models.rental import Rental
from app.models.user import User
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
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    rental = db.get(Rental, rental_id)

    if rental is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Rental not found.",
        )

    if not current_user.is_admin and rental.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to inspect this rental.",
        )

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