from uuid import UUID

from sqlalchemy.orm import Session

from app.models.rental import Rental, RentalStatus


ALLOWED_TRANSITIONS = {
    RentalStatus.DRAFT: {
        RentalStatus.PENDING_PAYMENT,
        RentalStatus.CANCELLED,
    },
    RentalStatus.PENDING_PAYMENT: {
        RentalStatus.CONFIRMED,
        RentalStatus.CANCELLED,
    },
    RentalStatus.CONFIRMED: {
        RentalStatus.READY_FOR_PICKUP,
        RentalStatus.CANCELLED,
    },
    RentalStatus.READY_FOR_PICKUP: {
        RentalStatus.ACTIVE,
        RentalStatus.CANCELLED,
    },
    RentalStatus.ACTIVE: {
        RentalStatus.RETURN_PENDING,
        RentalStatus.OVERDUE,
    },
    RentalStatus.RETURN_PENDING: {
        RentalStatus.RETURNED,
        RentalStatus.OVERDUE,
    },
    RentalStatus.RETURNED: {
        RentalStatus.COMPLETED,
    },
    RentalStatus.OVERDUE: {
        RentalStatus.RETURN_PENDING,
        RentalStatus.RETURNED,
    },
    RentalStatus.CANCELLED: set(),
    RentalStatus.COMPLETED: set(),
}


def transition_rental(
    db: Session,
    rental_id: UUID,
    new_status: RentalStatus,
) -> Rental:

    rental = db.get(Rental, rental_id)

    if rental is None:
        raise ValueError("Rental not found.")

    allowed_statuses = ALLOWED_TRANSITIONS.get(
        rental.status,
        set(),
    )

    if new_status not in allowed_statuses:
        raise ValueError(
            f"Cannot transition rental from "
            f"{rental.status.value} to {new_status.value}."
        )

    rental.status = new_status

    db.commit()
    db.refresh(rental)

    return rental