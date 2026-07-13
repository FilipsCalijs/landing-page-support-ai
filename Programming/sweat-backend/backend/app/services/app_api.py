"""Service layer for the private app API (app/api/app/v1/*).

This is the consumer-facing counterpart to the admin services. It never trusts a
browser directly — the Next.js BFF calls it with a shared secret and passes the
end user's identity explicitly as ``user_id`` (the frontend has already
authenticated the user via Auth.js). Every helper that touches a user's data
therefore takes ``user_id`` and enforces ownership, so one user can never reach
another user's chats.

Kept separate from the admin services so the two never entangle: these functions
carry no admin_id/audit context and only ever expose public (state="public")
characters and public (is_public=True) media.
"""

from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.config import get_settings
from app.models import (
    Account,
    CharacterProfile,
    Chat,
    ChatMessage,
    Subscription,
    User,
)
from app.models.enums import AuthProvider, PlanKey, SubscriptionState
from app.services import chats as chats_svc
from app.services.pagination import Page, paginate

# End users have no roles in this backend (roles belong to AdminUser); the frontend
# still expects a role in the identity payload, so every app user is "user".
APP_USER_ROLE = "user"


# --- Users / accounts -------------------------------------------------------

async def ensure_user(
    db: AsyncSession,
    *,
    email: str,
    google_sub: str | None = None,
    # name/image/locale/country are part of the frontend's Auth.js profile and have
    # no column here (identity lives in the frontend, this is the domain record).
    # They're accepted by the endpoint for a stable contract but intentionally not
    # persisted — adding columns would require a migration this phase avoids.
) -> tuple[User, Account]:
    """Upsert a domain User by email and guarantee a linked free Account.

    Called by the frontend right after Auth.js signs a user in, to mirror them into
    the backend. Matching is by email (the identity link between the frontend's uuid
    user and this backend's integer user); a Google sign-in also backfills google_sub.
    """
    email = email.strip().lower()
    if not email:
        raise HTTPException(status_code=422, detail="Email is required")

    user = await db.scalar(
        select(User).options(selectinload(User.account)).where(User.email == email)
    )
    if user is None:
        user = User(
            email=email,
            provider=AuthProvider.GOOGLE if google_sub else AuthProvider.EMAIL,
            google_sub=google_sub or None,
        )
        db.add(user)
        await db.flush()
        # Freshly created — no account yet. (Don't read user.account here: it would
        # trigger an async lazy-load; only the query above eager-loads it.)
        account = None
    else:
        if google_sub and not user.google_sub:
            # Existing email user linked a Google account on this sign-in.
            user.google_sub = google_sub
            user.provider = AuthProvider.GOOGLE
        account = user.account

    if account is None:
        account = Account(
            user_id=user.id,
            host=get_settings().main_host,
            plan_key=PlanKey.FREE,
            coins_balance=0,
        )
        db.add(account)
        await db.flush()

    await db.commit()
    return user, account


async def get_account_for_user(db: AsyncSession, user_id: int) -> Account | None:
    return await db.scalar(select(Account).where(Account.user_id == user_id))


async def get_current_subscription(db: AsyncSession, account_id: int) -> Subscription | None:
    """The account's most relevant subscription: an active one if present, else the
    most recent by creation (so an expired/canceled plan is still reflected in /me)."""
    active = await db.scalar(
        select(Subscription)
        .where(
            Subscription.account_id == account_id,
            Subscription.state == SubscriptionState.ACTIVE,
        )
        .order_by(Subscription.created_at.desc())
    )
    if active is not None:
        return active
    return await db.scalar(
        select(Subscription)
        .where(Subscription.account_id == account_id)
        .order_by(Subscription.created_at.desc())
    )


# --- Public characters ------------------------------------------------------

def _public_characters_query():
    return (
        select(CharacterProfile)
        .options(selectinload(CharacterProfile.media_assets))
        .where(CharacterProfile.state == "public")
        .order_by(CharacterProfile.created_at.desc())
    )


async def list_public_characters(db: AsyncSession, page: int = 1) -> Page:
    return await paginate(db, _public_characters_query(), page)


async def get_public_character(db: AsyncSession, handle: str) -> CharacterProfile | None:
    return await db.scalar(
        select(CharacterProfile)
        .options(selectinload(CharacterProfile.media_assets))
        .where(CharacterProfile.handle == handle, CharacterProfile.state == "public")
    )


# --- Chats (ownership-enforced) ---------------------------------------------

async def get_or_create_chat(db: AsyncSession, *, user_id: int, character_id: int) -> Chat:
    """Return the user's existing chat with this (public) character, or create one.

    One chat per (user, character): re-opening the same character returns the same
    conversation instead of stacking duplicates.
    """
    user = await db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    character = await db.scalar(
        select(CharacterProfile).where(
            CharacterProfile.id == character_id, CharacterProfile.state == "public"
        )
    )
    if character is None:
        raise HTTPException(status_code=404, detail="Character not found")

    existing = await db.scalar(
        select(Chat).where(Chat.user_id == user_id, Chat.character_id == character_id)
    )
    if existing is not None:
        return existing

    chat = Chat(user_id=user_id, character_id=character.id, character_name=character.name)
    db.add(chat)
    await db.commit()
    await db.refresh(chat)
    return chat


async def get_owned_chat(db: AsyncSession, chat_id: int, user_id: int) -> Chat:
    """Load a chat and assert it belongs to user_id, so no user can read or post to
    another user's conversation. 404 if it doesn't exist, 403 if it's someone else's."""
    chat = await chats_svc.get_chat(db, chat_id)
    if chat is None:
        raise HTTPException(status_code=404, detail="Chat not found")
    if chat.user_id != user_id:
        raise HTTPException(status_code=403, detail="Not your chat")
    return chat


async def post_user_message(db: AsyncSession, chat: Chat, *, content: str) -> ChatMessage:
    """Persist the user's message immediately (the assistant reply is generated by a
    background task the caller schedules) — reuses the same chats service the admin
    conversation UI uses, minus the admin/audit context."""
    return await chats_svc.save_user_message(db, chat, content=content)
