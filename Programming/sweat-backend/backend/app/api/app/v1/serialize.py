"""JSON serializers for the private app API.

Responses use camelCase keys to match the Next.js BFF's request bodies
(googleSub, userId, characterId). Media is always filtered to public assets — the
serializers here never emit draft/hidden characters or private media.
"""

from app.models import (
    Account,
    CharacterMediaAsset,
    CharacterProfile,
    ChatMessage,
    Subscription,
    User,
)


def media_dict(asset: CharacterMediaAsset) -> dict:
    return {
        "id": asset.id,
        "assetType": asset.asset_type,
        "mediaUrl": asset.media_url,
        "promptTag": asset.prompt_tag,
        "coinAmount": asset.coin_amount,
    }


def character_dict(profile: CharacterProfile) -> dict:
    return {
        "id": profile.id,
        "handle": profile.handle,
        "name": profile.name,
        "bioText": profile.bio_text,
        "characterType": profile.character_type,
        "style": profile.style,
        "age": profile.age,
        "label": profile.label,
        "followersCount": profile.followers_count,
        "unlockAllCreditAmount": profile.unlock_all_credit_amount,
        "createdAt": profile.created_at,
        # Only public assets are ever exposed to end users.
        "media": [media_dict(a) for a in profile.media_assets if a.is_public],
    }


def account_dict(account: Account) -> dict:
    return {"planKey": account.plan_key, "coinsBalance": account.coins_balance}


def user_identity_dict(user: User, account: Account) -> dict:
    return {
        "userId": user.id,
        "role": "user",
        "account": account_dict(account),
    }


def subscription_dict(subscription: Subscription) -> dict:
    return {
        "state": subscription.state,
        "interval": subscription.interval,
        "amount": float(subscription.amount),
        "currency": subscription.currency,
        "currentPeriodEnd": subscription.current_period_end,
        "canceledAt": subscription.canceled_at,
    }


def message_dict(message: ChatMessage) -> dict:
    return {
        "id": message.id,
        "role": message.role,
        "content": message.content,
        "imageTag": (message.meta or {}).get("image_tag"),
        "createdAt": message.created_at,
    }
