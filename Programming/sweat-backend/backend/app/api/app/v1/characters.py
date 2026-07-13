from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.app.v1.serialize import character_dict
from app.db.session import get_db
from app.services import app_api as svc

router = APIRouter(prefix="/characters", tags=["app-characters"])


@router.get("")
async def list_characters(page: int = 1, db: AsyncSession = Depends(get_db)):
    """Public character catalog (state=public only), paginated. Draft/hidden
    characters and private media are never returned."""
    result = await svc.list_public_characters(db, page=page)
    return {
        "items": [character_dict(c) for c in result.items],
        "page": result.page,
        "pages": result.pages,
        "total": result.total,
    }


@router.get("/{handle}")
async def get_character(handle: str, db: AsyncSession = Depends(get_db)):
    profile = await svc.get_public_character(db, handle)
    if profile is None:
        raise HTTPException(status_code=404, detail="Character not found")
    return character_dict(profile)
