"""Tests for the private app API (app/api/app/v1/*), the Next.js BFF entry point.

Data is seeded straight into the test db rather than through the admin publish flow
(which test_character_profiles.py already covers) to keep these focused on the app
API's own behavior: the shared-secret gate, email upsert, public-only exposure, and
per-user chat ownership.
"""

import pytest
from httpx import AsyncClient

from app.core.config import get_settings
from app.models import CharacterMediaAsset, CharacterProfile
from app.services import chats as chats_svc

SECRET = "test-internal-secret"
HEADERS = {"X-Internal-Secret": SECRET}


@pytest.fixture(autouse=True)
def _internal_secret():
    settings = get_settings()
    original = settings.internal_api_secret
    settings.internal_api_secret = SECRET
    yield
    settings.internal_api_secret = original


@pytest.fixture(autouse=True)
def _isolated_chat_bg(db_sessionmaker):
    # generate_reply_isolated (scheduled as a BackgroundTask by send_message) reaches
    # for the real Postgres SessionLocal by default — point it at the test's sqlite db.
    original = chats_svc.background_session_factory
    chats_svc.background_session_factory = db_sessionmaker
    yield
    chats_svc.background_session_factory = original


async def _seed_character(db_sessionmaker, *, handle: str, state: str, name: str = "Naomi") -> int:
    async with db_sessionmaker() as db:
        character = CharacterProfile(
            handle=handle, name=name, author_admin_id=1, state=state, bio_text="hi there"
        )
        db.add(character)
        await db.flush()
        db.add(
            CharacterMediaAsset(
                character_id=character.id, asset_type="profile",
                media_url="/media/public.png", prompt_tag="", coin_amount=10, is_public=True,
            )
        )
        db.add(
            CharacterMediaAsset(
                character_id=character.id, asset_type="photo",
                media_url="/media/private.png", prompt_tag="beach", coin_amount=25, is_public=False,
            )
        )
        await db.commit()
        return character.id


async def _ensure_user(client: AsyncClient, email: str) -> int:
    resp = await client.post("/api/app/v1/users/ensure", json={"email": email}, headers=HEADERS)
    assert resp.status_code == 200
    return resp.json()["userId"]


# --- Secret gate -----------------------------------------------------------

async def test_requires_internal_secret(client: AsyncClient):
    # No header at all
    missing = await client.post("/api/app/v1/users/ensure", json={"email": "a@b.com"})
    assert missing.status_code == 401
    # Wrong secret
    wrong = await client.post(
        "/api/app/v1/users/ensure", json={"email": "a@b.com"},
        headers={"X-Internal-Secret": "nope"},
    )
    assert wrong.status_code == 401
    # A GET endpoint is guarded too
    guarded_get = await client.get("/api/app/v1/characters")
    assert guarded_get.status_code == 401


# --- ensure user (upsert by email) -----------------------------------------

async def test_ensure_user_upserts_by_email(client: AsyncClient):
    first = await client.post(
        "/api/app/v1/users/ensure",
        json={"email": "Jane@Example.com", "name": "Jane", "googleSub": "g-123"},
        headers=HEADERS,
    )
    assert first.status_code == 200
    body = first.json()
    assert body["role"] == "user"
    assert body["account"] == {"planKey": "free", "coinsBalance": 0}
    user_id = body["userId"]

    # Same email (different casing) → same user, no duplicate.
    second = await client.post(
        "/api/app/v1/users/ensure", json={"email": "jane@example.com"}, headers=HEADERS
    )
    assert second.status_code == 200
    assert second.json()["userId"] == user_id


# --- public characters -----------------------------------------------------

async def test_list_characters_only_public(client: AsyncClient, db_sessionmaker):
    await _seed_character(db_sessionmaker, handle="public-girl", state="public")
    await _seed_character(db_sessionmaker, handle="hidden-girl", state="hidden")
    await _seed_character(db_sessionmaker, handle="draft-girl", state="draft")

    resp = await client.get("/api/app/v1/characters", headers=HEADERS)
    assert resp.status_code == 200
    data = resp.json()
    handles = {c["handle"] for c in data["items"]}
    assert handles == {"public-girl"}

    character = data["items"][0]
    # Only the public media asset is exposed — the private one is hidden.
    media_urls = {m["mediaUrl"] for m in character["media"]}
    assert media_urls == {"/media/public.png"}


async def test_get_character_by_handle_hides_nonpublic(client: AsyncClient, db_sessionmaker):
    await _seed_character(db_sessionmaker, handle="public-girl", state="public")
    await _seed_character(db_sessionmaker, handle="hidden-girl", state="hidden")

    ok = await client.get("/api/app/v1/characters/public-girl", headers=HEADERS)
    assert ok.status_code == 200
    assert ok.json()["handle"] == "public-girl"
    assert len(ok.json()["media"]) == 1

    hidden = await client.get("/api/app/v1/characters/hidden-girl", headers=HEADERS)
    assert hidden.status_code == 404


# --- me --------------------------------------------------------------------

async def test_me_returns_plan_and_balance(client: AsyncClient):
    user_id = await _ensure_user(client, "me@example.com")
    resp = await client.get(f"/api/app/v1/me?userId={user_id}", headers=HEADERS)
    assert resp.status_code == 200
    body = resp.json()
    assert body["planKey"] == "free"
    assert body["coinsBalance"] == 0
    assert body["subscription"] is None


# --- chats & ownership -----------------------------------------------------

async def test_chat_creation_is_idempotent(client: AsyncClient, db_sessionmaker):
    user_id = await _ensure_user(client, "owner@example.com")
    char_id = await _seed_character(db_sessionmaker, handle="chat-girl", state="public")

    first = await client.post(
        "/api/app/v1/chats", json={"userId": user_id, "characterId": char_id}, headers=HEADERS
    )
    assert first.status_code == 200
    second = await client.post(
        "/api/app/v1/chats", json={"userId": user_id, "characterId": char_id}, headers=HEADERS
    )
    # Re-opening the same character returns the same chat, not a duplicate.
    assert second.json()["id"] == first.json()["id"]


async def test_cannot_access_another_users_chat(client: AsyncClient, db_sessionmaker):
    owner_id = await _ensure_user(client, "owner@example.com")
    other_id = await _ensure_user(client, "intruder@example.com")
    char_id = await _seed_character(db_sessionmaker, handle="chat-girl", state="public")

    created = await client.post(
        "/api/app/v1/chats", json={"userId": owner_id, "characterId": char_id}, headers=HEADERS
    )
    chat_id = created.json()["id"]

    # Owner can read their chat.
    ok = await client.get(f"/api/app/v1/chats/{chat_id}/messages?userId={owner_id}", headers=HEADERS)
    assert ok.status_code == 200

    # A different user is forbidden from reading or posting to it.
    read = await client.get(f"/api/app/v1/chats/{chat_id}/messages?userId={other_id}", headers=HEADERS)
    assert read.status_code == 403
    post = await client.post(
        f"/api/app/v1/chats/{chat_id}/messages",
        json={"userId": other_id, "content": "hey"}, headers=HEADERS,
    )
    assert post.status_code == 403

    # A chat that doesn't exist is a 404.
    missing = await client.get(f"/api/app/v1/chats/999999/messages?userId={owner_id}", headers=HEADERS)
    assert missing.status_code == 404


async def test_send_message_saves_user_message(client: AsyncClient, db_sessionmaker):
    user_id = await _ensure_user(client, "chatter@example.com")
    char_id = await _seed_character(db_sessionmaker, handle="chat-girl", state="public")
    created = await client.post(
        "/api/app/v1/chats", json={"userId": user_id, "characterId": char_id}, headers=HEADERS
    )
    chat_id = created.json()["id"]

    sent = await client.post(
        f"/api/app/v1/chats/{chat_id}/messages",
        json={"userId": user_id, "content": "Hello there!"}, headers=HEADERS,
    )
    assert sent.status_code == 200
    body = sent.json()
    assert body["status"] == "reply_pending"
    assert body["message"]["role"] == "user"
    assert body["message"]["content"] == "Hello there!"

    # The user's message is immediately readable.
    listed = await client.get(
        f"/api/app/v1/chats/{chat_id}/messages?userId={user_id}", headers=HEADERS
    )
    contents = [m["content"] for m in listed.json()["items"]]
    assert "Hello there!" in contents
