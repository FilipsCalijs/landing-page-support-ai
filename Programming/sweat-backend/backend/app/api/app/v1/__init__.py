"""Private app API — consumer-facing endpoints called by the Next.js BFF only.

Every route in this router is guarded by require_internal_secret: the caller must
present the shared X-Internal-Secret header (the Next.js server), or it gets 401.
End-user identity is NOT established here — it's passed explicitly (userId) by the
already-authenticated frontend. See app/services/app_api.py for the ownership rules.
"""

from fastapi import APIRouter, Depends

from app.api.app.v1 import characters, chats, me, users
from app.deps import require_internal_secret

router = APIRouter(dependencies=[Depends(require_internal_secret)])
router.include_router(users.router)
router.include_router(characters.router)
router.include_router(me.router)
router.include_router(chats.router)
