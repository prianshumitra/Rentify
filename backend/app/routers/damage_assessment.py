from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.damage_assessment import DamageAssessmentCreate
from app.services.damage_assessment import create_damage_assessment


router = APIRouter(
    prefix="/api/v1/rentals",
    tags=["Damage Assessment"],
)


@router.post(
    "/{rental_id}/damage-assessment",
    status_code=status.HTTP_201_CREATED,
)
def create_damage_assessment_endpoint(
    rental_id: UUID,
    assessment_data: DamageAssessmentCreate,
    db: Session = Depends(get_db),
):
    try:
        assessment = create_damage_assessment(
            db=db,
            rental_id=rental_id,
            severity=assessment_data.severity,
            description=assessment_data.description,
            estimated_charge=assessment_data.estimated_charge,
        )

        return {
            "id": assessment.id,
            "rental_id": assessment.rental_id,
            "severity": assessment.severity,
            "description": assessment.description,
            "estimated_charge": assessment.estimated_charge,
            "assessed_at": assessment.assessed_at,
        }

    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(exc),
        )