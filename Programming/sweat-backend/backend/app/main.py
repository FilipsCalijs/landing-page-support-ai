from pathlib import Path

from fastapi import Depends, FastAPI, Request
from fastapi.openapi.docs import get_swagger_ui_html
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from starlette.middleware.base import BaseHTTPMiddleware

from app.admin_ui import auth as ui_auth
from app.admin_ui import (
    chat,
    character,
    creator,
    crm_billing,
    crm_catalog,
    crm_home,
    crm_users,
    home,
    system,
    user_space,
)
from app.api.admin.v1 import router as admin_api_router
from app.api.app.v1 import router as app_api_router
from app.api.track import router as track_router
from app.api.webhooks import router as webhooks_router
from app.core.config import get_settings
from app.core.rate_limit import check_rate_limit, client_ip
from app.deps import LoginRequired, current_admin_api

SECURITY_HEADERS = {
    "X-Frame-Options": "DENY",
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "same-origin",
    "Content-Security-Policy": (
        "default-src 'self'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; "
        "script-src 'self'; frame-ancestors 'none'"
    ),
}


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        response = await call_next(request)
        for name, value in SECURITY_HEADERS.items():
            response.headers.setdefault(name, value)
        if get_settings().env == "prod":
            response.headers.setdefault(
                "Strict-Transport-Security", "max-age=63072000; includeSubDomains"
            )
        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        path = request.url.path
        if path.startswith(("/admin", "/api")) and not path.startswith("/static"):
            settings = get_settings()
            try:
                await check_rate_limit(
                    f"general:{client_ip(request)}",
                    settings.rate_limit_general,
                    settings.rate_limit_general_window,
                )
            except Exception as exc:
                from fastapi import HTTPException

                if isinstance(exc, HTTPException):
                    return JSONResponse({"detail": exc.detail}, status_code=exc.status_code)
                raise
        return await call_next(request)


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.project_name, docs_url=None, redoc_url=None, openapi_url=None)

    app.add_middleware(SecurityHeadersMiddleware)
    app.add_middleware(RateLimitMiddleware)

    static_dir = Path(__file__).parent / "static"
    app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

    media_dir = Path(settings.media_dir)
    media_dir.mkdir(parents=True, exist_ok=True)
    app.mount(settings.media_url_prefix, StaticFiles(directory=str(media_dir)), name="media")

    app.include_router(ui_auth.router)
    app.include_router(home.router)
    app.include_router(creator.router)
    app.include_router(character.router)
    app.include_router(user_space.router)
    app.include_router(chat.router)
    app.include_router(crm_home.router)
    app.include_router(crm_users.router)
    app.include_router(crm_billing.router)
    app.include_router(crm_catalog.router)
    app.include_router(system.router)
    app.include_router(admin_api_router, prefix="/api/admin/v1")
    app.include_router(app_api_router, prefix="/api/app/v1")
    app.include_router(webhooks_router, prefix="/api/webhooks")
    app.include_router(track_router, prefix="/api/track")

    @app.exception_handler(LoginRequired)
    async def login_required_handler(request: Request, exc: LoginRequired):
        return RedirectResponse("/admin/login", status_code=303)

    @app.get("/", include_in_schema=False)
    async def root():
        return RedirectResponse("/admin", status_code=307)

    @app.get("/health", include_in_schema=False)
    async def health():
        return {"status": "ok"}

    # OpenAPI docs, admins only
    @app.get("/api/openapi.json", include_in_schema=False)
    async def openapi_json(_=Depends(current_admin_api)):
        return JSONResponse(app.openapi())

    @app.get("/api/docs", include_in_schema=False)
    async def swagger_docs(_=Depends(current_admin_api)):
        return get_swagger_ui_html(openapi_url="/api/openapi.json", title=f"{settings.project_name} API")

    return app


app = create_app()
