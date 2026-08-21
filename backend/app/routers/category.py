from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryOut

router = APIRouter(
    prefix="/api/v1/categories",
    tags=["Categories"],
)

DEFAULT_CATEGORIES = [
    {"name": "Cameras & Cinema Equipment", "slug": "cameras-cinema-equipment", "description": "DSLR, Mirrorless, Cinema cameras and accessories"},
    {"name": "Audio & Sound Recording", "slug": "audio-sound-recording", "description": "Microphones, wireless lavaliers, audio recorders, mixers"},
    {"name": "Lenses & Optics", "slug": "lenses-optics", "description": "Prime lenses, zoom lenses, anamorphic optics, filters"},
    {"name": "Lighting & Grip Equipment", "slug": "lighting-grip-equipment", "description": "LED panels, COB lights, softboxes, light stands, c-stands"},
    {"name": "Drones & Aerial Video", "slug": "drones-aerial-video", "description": "FPV drones, quadcopters, gimbal mounts, drone accessories"},
    {"name": "Studio & Production Accessories", "slug": "studio-production-accessories", "description": "Tripods, gimbals, field monitors, batteries, memory cards"},
    {"name": "General Rental Equipment", "slug": "general-rental-equipment", "description": "Miscellaneous gear and utility rental items"}
]


@router.get("", response_model=list[CategoryOut])
def list_categories_endpoint(db: Session = Depends(get_db)):
    categories = db.query(Category).filter(Category.is_active.is_(True)).all()
    if not categories:
        # Seed default categories automatically if DB has 0 categories
        for cat_data in DEFAULT_CATEGORIES:
            cat = Category(
                name=cat_data["name"],
                slug=cat_data["slug"],
                description=cat_data["description"],
                is_active=True,
            )
            db.add(cat)
        db.commit()
        categories = db.query(Category).filter(Category.is_active.is_(True)).all()
    return categories


@router.post("", response_model=CategoryOut, status_code=status.HTTP_201_CREATED)
def create_category_endpoint(cat_data: CategoryCreate, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.slug == cat_data.slug).first()
    if existing:
        return existing
    cat = Category(
        name=cat_data.name,
        slug=cat_data.slug,
        description=cat_data.description,
        is_active=True,
    )
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat
