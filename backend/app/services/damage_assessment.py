from uuid import UUID

from sqlalchemy.orm import Session

from app.models.damage_assessment import (
    DamageAssessment,
    DamageSeverity,
)
from app.models.rental import Rental, RentalStatus


def create_damage_assessment(
    db: Session,
    rental_id: UUID,
    severity: DamageSeverity,
    description: str,
    estimated_charge,
) -> DamageAssessment:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    if rental.status != RentalStatus.RETURNED:
        raise ValueError(
            "Rental must be returned before damage can be assessed."
        )

    if severity == DamageSeverity.MINOR and estimated_charge > 10000:
        raise ValueError(
            "Minor damage cannot have a charge above 10000."
        )

    existing_assessment = (
        db.query(DamageAssessment)
        .filter(DamageAssessment.rental_id == rental_id)
        .first()
    )

    if existing_assessment:
        raise ValueError(
            "Damage assessment already exists for this rental."
        )

    assessment = DamageAssessment(
        rental_id=rental_id,
        severity=severity,
        description=description,
        estimated_charge=estimated_charge,
    )

    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    return assessment