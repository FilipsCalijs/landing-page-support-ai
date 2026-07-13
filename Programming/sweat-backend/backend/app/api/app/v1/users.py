from fastapi import APIRouter, Depends
from pydantic import BaseModel, EmailStr
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.app.v1.serialize import user_identity_dict
from app.db.session import get_db
from app.services import app_api as svc

router = APIRouter(prefix="/users", tags=["app-users"])


class EnsureUserBody(BaseModel):
    email: EmailStr
    # Auth.js profile fields — accepted for a stable contract, but identity/profile
    # lives in the frontend, so only email + googleSub map to columns here.
    name: str | None = None
    image: str | None = None
    locale: str | None = None
    country: str | None = None
    googleSub: str | None = None


@router.post("/ensure")
async def ensure_user(body: EnsureUserBody, db: AsyncSession = Depends(get_db)):
    """Mirror an Auth.js-authenticated user into the backend (upsert by email) and
    guarantee a free Account. Returns the domain identity the frontend caches."""
    user, account = await svc.ensure_user(db, email=body.email, google_sub=body.googleSub)
    return user_identity_dict(user, account)
