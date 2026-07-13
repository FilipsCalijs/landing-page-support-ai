from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.app.v1.serialize import subscription_dict
from app.db.session import get_db
from app.services import app_api as svc

router = APIRouter(tags=["app-me"])


@router.get("/me")
async def get_me(userId: int, db: AsyncSession = Depends(get_db)):
    """Plan / coin balance / subscription for the given user's account. userId is
    passed by the trusted frontend (which authenticated the user via Auth.js)."""
    account = await svc.get_account_for_user(db, userId)
    if account is None:
        raise HTTPException(status_code=404, detail="Account not found")
    subscription = await svc.get_current_subscription(db, account.id)
    return {
        "userId": userId,
        "planKey": account.plan_key,
        "coinsBalance": account.coins_balance,
        "subscription": subscription_dict(subscription) if subscription else None,
    }
