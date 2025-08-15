from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from database import get_db
import models, schemas
from security import hash_password, verify_password, create_access_token
import re

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/signup", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def signup(payload: schemas.SignupIn, db: Session = Depends(get_db)):
    # duplicates
    exists_email = db.scalar(select(models.User).where(models.User.email == payload.email.lower()))
    if exists_email:
        raise HTTPException(status_code=409, detail="Email already registered")
    exists_wa = db.scalar(select(models.User).where(models.User.whatsapp == payload.whatsapp))
    if exists_wa:
        raise HTTPException(status_code=409, detail="WhatsApp number already registered")

    user = models.User(
        name=payload.name.strip(),
        email=payload.email.lower(),
        password_hash=hash_password(payload.password),
        whatsapp=payload.whatsapp,
        telegram=(payload.telegram or None),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def _normalize_phone(v: str) -> str:
    x = v.strip().replace(" ", "")
    if not x.startswith("+") and re.match(r"^\d+$", x):
        x = "+" + x
    return x

@router.post("/login", response_model=schemas.TokenOut)
def login(payload: schemas.LoginIn, db: Session = Depends(get_db)):
    ident = payload.identifier.strip()
    user = None
    if "@" in ident:
        user = db.scalar(select(models.User).where(models.User.email == ident.lower()))
    else:
        wa = _normalize_phone(ident)
        user = db.scalar(select(models.User).where(models.User.whatsapp == wa))

    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token(subject=user.id)
    return {"access_token": token, "token_type": "bearer", "user": user}
