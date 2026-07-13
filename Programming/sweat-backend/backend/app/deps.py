from dataclasses import dataclass
from hmac import compare_digest

from fastapi import Depends, HTTPException, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import get_session
from app.db.session import get_db
from app.models import AdminUser


class LoginRequired(Exception):
    """Raised by UI dependencies; the app-level handler redirects to /admin/login."""


@dataclass
class AdminContext:
    admin: AdminUser
    csrf_token: str
    session_token: str


async def _resolve_admin(request: Request, db: AsyncSession) -> AdminContext | None:
    token = request.cookies.get(get_settings().session_cookie_name)
    data = await get_session(token)
    if not data:
        return None
    admin = await db.get(AdminUser, data["admin_id"])
    if admin is None or not admin.is_active:
        return None
    return AdminContext(admin=admin, csrf_token=data["csrf"], session_token=token)


async def current_admin_ui(request: Request, db: AsyncSession = Depends(get_db)) -> AdminContext:
    ctx = await _resolve_admin(request, db)
    if ctx is None:
        raise LoginRequired
    return ctx


async def current_admin_api(request: Request, db: AsyncSession = Depends(get_db)) -> AdminContext:
    ctx = await _resolve_admin(request, db)
    if ctx is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return ctx


def validate_csrf(ctx: AdminContext, token: str | None) -> None:
    if not token or token != ctx.csrf_token:
        raise HTTPException(status_code=403, detail="Invalid CSRF token")


async def require_internal_secret(request: Request) -> None:
    """Guards the private app API (app/api/app/v1/*): only the Next.js BFF server may
    call it, proven by the shared X-Internal-Secret header. Compared in constant time
    so a wrong secret can't be recovered by timing. This is NOT end-user auth — the
    user's identity is passed explicitly by the trusted frontend (userId in the body
    or query), which has already authenticated the user via Auth.js."""
    provided = request.headers.get("X-Internal-Secret")
    expected = get_settings().internal_api_secret
    if not provided or not compare_digest(provided, expected):
        raise HTTPException(status_code=401, detail="Not authenticated")
