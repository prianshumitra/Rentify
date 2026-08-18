from uuid import UUID

from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str
    last_name: str
    is_vendor: bool = False
    is_admin: bool = False


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: UUID
    email: EmailStr
    first_name: str
    last_name: str
    is_admin: bool
    is_vendor: bool
    is_active: bool

    model_config = {
        "from_attributes": True,
    }


class UserRoleUpdate(BaseModel):
    is_vendor: bool | None = None
    is_admin: bool | None = None


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut | None = None