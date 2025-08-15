from __future__ import annotations
from pydantic import BaseModel, EmailStr, field_validator

PHONE_RE = r"^\+?[1-9]\d{7,14}$"

class SignupIn(BaseModel):
    name: str
    email: EmailStr
    password: str
    whatsapp: str
    telegram: str | None = None
    # ... keep validators as you have ...

class LoginIn(BaseModel):
    identifier: str  # email OR whatsapp
    password: str

    @field_validator("identifier")
    @classmethod
    def strip_identifier(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("identifier is required")
        return v

class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr
    whatsapp: str
    telegram: str | None = None
    class Config:
        from_attributes = True

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut
