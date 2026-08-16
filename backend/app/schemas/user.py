from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    is_admin: bool
    is_active: bool

    model_config = {
        "from_attributes": True,
    }


class Token(BaseModel):
    access_token: str
    token_type: str