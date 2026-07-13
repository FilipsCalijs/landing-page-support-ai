from fastapi import APIRouter, BackgroundTasks, Depends
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.app.v1.serialize import message_dict
from app.db.session import get_db
from app.services import app_api as svc
from app.services import chats as chats_svc

router = APIRouter(prefix="/chats", tags=["app-chats"])


class CreateChatBody(BaseModel):
    userId: int
    characterId: int


class SendMessageBody(BaseModel):
    userId: int
    content: str


@router.post("")
async def create_chat(body: CreateChatBody, db: AsyncSession = Depends(get_db)):
    """Open (or reuse) the user's conversation with a public character."""
    chat = await svc.get_or_create_chat(db, user_id=body.userId, character_id=body.characterId)
    return {
        "id": chat.id,
        "characterId": chat.character_id,
        "characterName": chat.character_name,
        "messagesCount": chat.messages_count,
    }


@router.post("/{chat_id}/messages")
async def send_message(
    chat_id: int,
    body: SendMessageBody,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    """Save the user's message immediately and generate the assistant reply in the
    background (same flow the admin conversation UI uses). Ownership is enforced:
    a user can only post to their own chat."""
    chat = await svc.get_owned_chat(db, chat_id, body.userId)
    message = await svc.post_user_message(db, chat, content=body.content)
    # Reply is produced after the response is sent; the client polls for it.
    background_tasks.add_task(chats_svc.generate_reply_isolated, chat.id, admin_id=None, ip=None)
    return {"message": message_dict(message), "status": "reply_pending"}


@router.get("/{chat_id}/messages")
async def list_messages(chat_id: int, userId: int, db: AsyncSession = Depends(get_db)):
    chat = await svc.get_owned_chat(db, chat_id, userId)
    return {"items": [message_dict(m) for m in chat.messages]}
