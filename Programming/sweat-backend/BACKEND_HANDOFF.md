# Sweat Companion — Backend Handoff (для фронтенд-интеграции)

Этот файл — снимок текущего состояния бэкенда на 2026-07-13. Пиши сюда актуализации, если бэкенд меняется существенно (новые таблицы, новые публичные эндпоинты).

## 0. Самое важное — прочитать первым

**Прямого публичного API для БРАУЗЕРА конечного пользователя по-прежнему нет** — фронт (Next.js + Auth.js) авторизует юзеров сам и ходит в бэк по BFF-паттерну. Что есть:

1. `/admin/*` — серверный Jinja UI для админов/CRM-команды (не JSON, HTML-страницы с формами).
2. `/api/admin/v1/*` — JSON API, но требует admin-сессию (cookie). Использует его сама админка (её JS), не задумывался как публичный API.
3. `/api/app/v1/*` — **приватный app API для фронт-сервера (BFF)**, добавлен в Фазе 1. Не логинит юзеров: доверяет Next.js-серверу по общему секрету `X-Internal-Secret` и получает `userId` явно. См. §4.4.
4. `/api/webhooks/{provider}` — вебхуки платёжного провайдера.
5. `/api/track/visit` — по-настоящему публичный эндпоинт (счётчик визитов, без auth).

Модель `User` (таблица `users`) в БД уже существует и на неё ссылаются `Chat`, `CharacterProfileRequest`, `Account` — то есть **данные под конечных пользователей заложены**, но:
- нет `/api/auth/register`, `/api/auth/login`, JWT-выдачи и т.п.
- нет публичного `/api/chat/send`, `/api/characters`, `/api/catalog` и т.п.

**Вывод для фронтенд-агента:** если нужен реальный consumer-facing API (регистрация, чат, каталог персонажей, покупки) — его нужно **спроектировать и добавить в этот бэкенд** (по аналогии с `/api/admin/v1/*`, но с auth конечного пользователя вместо admin-сессии). Ниже — вся схема БД и сервисы, на основе которых такой API логично строить.

---

## 1. Технологический стек

| Слой | Технология |
|---|---|
| Web-фреймворк | **FastAPI** (async) + **Uvicorn** |
| БД | **PostgreSQL 16** |
| ORM | **SQLAlchemy 2.0** (async, `asyncpg` драйвер) |
| Миграции | **Alembic** (`backend/alembic/versions/`) |
| Кэш/сессии | **Redis 7** (admin-сессии, rate-limit) |
| Шаблоны (админка) | **Jinja2** — сервер рендерит HTML, не SPA |
| HTTP-клиент | **httpx** (async) — для RunPod, OpenRouter, S3 |
| Пароли | **argon2-cffi** (только для `AdminUser`, у `User` пароль опционален) |
| Тесты | **pytest** + **pytest-asyncio**, `aiosqlite` (SQLite в тестах вместо Postgres), `fakeredis` |
| Линтер | **ruff** |
| Деплой | Docker / docker-compose (`postgres:16-alpine`, `redis:7-alpine`, app на порту **8000**) |

Запуск локально: `docker-compose up` (Postgres → `localhost:5433`, Redis → `localhost:6380`), приложение — `uvicorn app.main:app` из `backend/`.

Конфиг — `backend/app/core/config.py`, читает `.env` (сначала `backend/.env`, потом корневой `.env`). Ключевые группы настроек: `database_url`, `redis_url`, session/cookie, rate-limit, `weights_storage`/`media_storage` (local/s3), `generation_provider` (stub/runpod) + все `runpod_*` (API-ключ, отдельный endpoint id на каждый workflow-шаблон, пути к ComfyUI JSON-графам).

---

## 2. Аутентификация — как это работает сейчас

**Есть только admin-аутентификация.** `AdminUser` (внутренние сотрудники) логинится через `/admin/login` (email+пароль, argon2), получает cookie-сессию (`sc_admin_session`, хранится в Redis, TTL 12ч). Два FastAPI dependency:
- `current_admin_ui` — для Jinja-страниц, при провале редиректит на `/admin/login`.
- `current_admin_api` — для JSON API, при провале даёт `401`.
- CSRF: все POST/PUT/DELETE в админке требуют `csrf_token` из сессии.

**`User` (конечный пользователь приложения) — это просто строка в БД, без логики логина.** Поля: `email`, `password_hash` (nullable), `provider` (`email`/`google`), `google_sub`, `status` (`active`/`banned`), `sign_in_count`, `last_sign_in_at`. Сейчас пользователей создаёт только админ вручную (CRM UI) или сервисные скрипты (`scripts/seed.py`). **Если фронтенду нужен реальный signup/login — эту часть нужно построить с нуля** (эндпоинты, хэширование пароля пользователя, выдача токена/сессии для фронтенда, Google OAuth callback и т.д.), скорее всего в новом `app/api/public/` или `app/api/v1/` роутере.

---

## 3. База данных — полная схема

Все таблицы через SQLAlchemy async ORM, файлы в `backend/app/models/`. Все `created_at`/`updated_at` — `DateTime(timezone=True)`, хранятся в UTC.

### 3.1 Пользователи и аккаунты

**`users`** (`app/models/user.py`)
| Колонка | Тип | Заметки |
|---|---|---|
| id | Integer PK | |
| email | String(255) | UNIQUE, INDEX |
| password_hash | String(255) | nullable |
| provider | String(32) | `AuthProvider`: `email`/`google` |
| google_sub | String(255) | UNIQUE, nullable |
| status | String(32) | `UserStatus`: `active`/`banned` |
| sign_in_count | Integer | default 0 |
| last_sign_in_at | DateTime | nullable |
| created_at | DateTime | |

→ 1:1 `Account`, 1:N `Chat`, 1:N `CharacterProfileRequest`.

**`accounts`** (`app/models/user.py`)
| Колонка | Тип | Заметки |
|---|---|---|
| id | Integer PK | |
| user_id | Integer FK→users.id | UNIQUE, CASCADE |
| host | String(255) | INDEX |
| plan_key | String(32) | `PlanKey`: `free`/`premium`/`unlimited`, default `free` |
| coins_balance | Integer | default 0 — игровая валюта |
| created_at | DateTime | |

→ 1:N `Subscription`, 1:N `Transaction`, 1:N `CoinLedgerEntry`, 1:N `RetentionOfferRedemption`.

**`admin_users`** — внутренние админы (`email`, `password_hash`, `role`, `is_active`, `last_login_at`). Не связаны с `User`.

### 3.2 Персонажи и медиа

**`character_profiles`** (`app/models/character_profile.py`)
| Колонка | Тип | Заметки |
|---|---|---|
| id | Integer PK | |
| handle | String(150) | UNIQUE, INDEX — публичный slug |
| name | String(150) | |
| author_admin_id | Integer FK→admin_users.id | |
| state | String(32) | `draft`/`hidden`/`public`, INDEX |
| bio_text | Text | |
| followers_count | Integer | default 0 |
| source_workflow_run_id | Integer FK→workflow_runs.id | nullable |
| character_type | String(16) | `female`/`male` |
| style | String(32) | `realistic`/`semi-realistic`/`ai`/`anime` |
| age | Integer | nullable |
| unlock_all_credit_amount | Integer | default 0 — цена в коинах за разблокировку всех медиа |
| label | String(16) | `new`/`hot`/`popular` |
| prompt_config | String(255) | |
| chat_system_prompt | Text | системный промпт персонажа для чата |
| created_at | DateTime | |

→ 1:N `CharacterMediaAsset`, 1:N `Chat`.

**`character_media_assets`**: `character_id` FK (CASCADE), `asset_type`, `media_url`, `prompt_tag` (используется как enum image_tag в чате — см. §5a), `coin_amount` (default 10, цена разблокировки), `is_public`.

### 3.3 Чат с ИИ-персонажем

**`chats`**: `user_id` FK→users (CASCADE), `character_name`, `character_id` FK→character_profiles (SET NULL, nullable), `llm` (модель, использованная последней), `messages_count`, `last_message_at`.

**`chat_messages`**: `chat_id` FK (CASCADE), `role` (`user`/`assistant`/`system`), `content` Text, `meta` JSON (хранит raw LLM response, `violated` флаг, `image_tag` и т.п.).

**`chat_prompt_configs`**: набор конфигов промпта для чата (`name`, `use_json_schema`, `error_message`, `violated_message`, `system_prefix_part`/`system_suffix_part`, `json_prefix_part`/`json_suffix_part`, `max_tokens`, `presence_penalty`, `frequency_penalty`, `top_p`, `temperature`). "Активный" конфиг = последний по id (нет пока привязки конфига к конкретному персонажу).

**`base_prompt_configs`**: singleton (всегда 1 строка), `prompt` Text — общий базовый промпт для всех чатов.

**`app_settings`**: singleton, `openrouter_api_key`, `chat_llm_model` (default `x-ai/grok-4.3`).

### 3.4 Заявки на профиль персонажа (user-space)

**`character_profile_requests`**: `user_id` FK (CASCADE), `state` (`pending`/`processing`/`subscription_required`/`completed`/`failed`), `name`, `character_profile`, `error`, `payload` JSON.
**`character_profile_request_logs`**: `request_id` FK (CASCADE), `level`, `message` — лог выполнения заявки.

### 3.5 Генерация изображений/видео (ComfyUI + RunPod)

**`weight_files`**: `kind` (`lora`/`checkpoint`), `filename`, `enabled`, `size_bytes`, `synced_at`, `volume_synced_at`. UNIQUE(kind, filename).

**`gen_workflows`**: шаблон workflow-а (`key` UNIQUE, `name`, `type` — `WorkflowType`: `public_character`/`preview_character`/`user_private_character`, `state` `active`/`disabled`, `description`).
**`gen_workflow_steps`**: `workflow_id` FK (CASCADE), `position`, `key`, `kind` (`StepKind`: `profile_image`/`chat_image`/`video`), `depends_on` (key другого шага), `config` JSON.

**`image_workflow_configs`**: именованный пресет генерации — `name`, `checkpoint`, `resolution` (например `1024x1024`), `is_default` (только один true), `workflow_template` (`main_sdxl`/`illustration` — ключ, определяющий какой ComfyUI-граф и какой RunPod endpoint использовать). **KSampler/FaceDetailer/negative-prompt параметры больше НЕ хранятся в БД** — они захардкожены в самих ComfyUI JSON-шаблонах на диске (`backend/app/services/generation/runpod_workflow_template*.json`).
**`image_workflow_config_loras`**: `config_id` FK (CASCADE), `position`, `lora_filename`, `strength`.

**`workflow_runs`**: экземпляр запуска — `workflow_id` FK, `run_type`, `character_name`/`character_handle`/`bio_text`/`character_prompt` (данные персонажа для генерации), `lora_filename`, `prompt_prefix`, `image_workflow_config_id` FK nullable, `clothing_mode` (`none`), `state` (`pending`/`processing`/`completed`/`failed`), `started_at`/`finished_at`.
**`workflow_run_steps`**: `run_id` FK (CASCADE), `position`, `key`, `kind`, `title`, `depends_on`, `step_config` JSON, `state` (`pending`/`succeeded`/`failed`/`rejected`/`restricted`), `media_url`, `prediction_prompt`, `input_data`/`output_data` JSON, `error_message`.

### 3.6 "Flow" — отдельный, более простой пайплайн генерации фото (user-space фичи)

**`flows`**: `key` UNIQUE, `name`, `api_key`, `llm_model`. → `flow_models` (список доступных image-моделей с `is_nsfw`), `flow_steps` (шаблон шагов), `flow_generations` (запуски) → `flow_generation_steps`/`flow_generation_images`/`flow_step_images`. Это параллельная (более простая, без ComfyUI) генерационная система — используется, судя по всему, для отдельного "photo flow" фичи в user-space, не пересекается напрямую с character workflow выше.

### 3.7 Биллинг и монетизация

**`plans`** (key, name, features JSON, active, position) → **`plan_prices`** (по `price_group_id` + `interval`: `month`/`quarter`/`year`/`one_time`, `amount`, `original_amount`).
**`price_groups`** (валюта/регион, `is_main`) → **`countries`** (код страны → price_group).
**`coin_bundles`** (пакеты коинов на продажу: `bundle_type` `standard`/`offer`, `offer_type` `after_subscription`/`retention`/`seasonal`, `discount_percent`, `coins_amount`) → **`coin_bundle_prices`**.
**`subscriptions`**: `account_id` FK (CASCADE), `plan_id` FK, `state` (`incomplete`/`active`/`past_due`/`canceled`/`failed`/`expired`), `interval`, `amount`, `currency`, `provider`, `provider_subscription_id`, `current_period_end`, `canceled_at`.
**`transactions`**: `account_id` FK (CASCADE), `type` (`coins`/`checkout`/`recurring`), `state` (`pending`/`processing`/`succeeded`/`failed`/`refunded`/`chargeback`/`expired_checkout`), `amount`, `currency`, `provider`, `provider_transaction_id`, `is_recurring`, `meta` JSON.
**`coin_ledger`**: `account_id` FK (CASCADE), `delta` (+/-), `reason`, `ref`.
**`retention_offers`**/**`retention_offer_redemptions`**: скидочные предложения на удержание подписчиков.
**`payout_transactions`**: выплаты (не пользователям — скорее партнёрские/т.п.).

### 3.8 Прочее

**`audit_logs`**: лог всех admin-действий (`admin_user_id`, `action`, `entity_type`/`entity_id`, `changes` JSON, `ip`). **`daily_visits`**: `day` PK, `count` — из `/api/track/visit`.

---

## 4. Маршруты — что уже есть

### 4.1 Публичное (без auth)
- `GET /health` → `{"status": "ok"}`
- `POST /api/track/visit` → 204, увеличивает счётчик визитов на сегодня
- `POST /api/webhooks/{provider_name}` → обработка платёжных вебхуков (сигнатура в заголовке)

### 4.2 Admin JSON API — `/api/admin/v1/*` (требует admin cookie-сессию, `current_admin_api`)
Это не то, что должен вызывать фронтенд конечного пользователя — но контракты полезны как референс структур данных:
- `image-workflow-configs` (CRUD), `weights/{kind}` (list/enable/sync), `gen-workflows` (CRUD + steps), `workflow-runs` (CRUD + reject/reexecute step)
- `price-groups`, `countries`, `plans`, `coin-bundles`, `retention-offers` (каталог биллинга, в основном read/CRUD)
- `subscriptions`, `transactions`, `payouts` (read-only списки с пагинацией и фильтрами)
- `users` (list/get/patch/impersonate), `accounts` (list)
- `character-requests` (list/get/delete + логи), `chats` (CRUD + messages) — админский интерфейс к тем же таблицам `Chat`/`ChatMessage`, что и conversation UI
- `stats/overview`, `stats/users`, `stats/accounts`, `stats/subscriptions`, `stats/transactions`

### 4.3 Admin UI (Jinja, HTML) — `/admin/*`
- `/admin/login`, `/admin/logout`
- `/admin/home` — дашборд
- `/admin/crm/*` — пользователи, подписки/транзакции/выплаты, каталог (планы/цены/коины/офферы)
- `/admin/character/*` — управление профилями персонажей
- `/admin/creator/*` — workflows, image workflow configs, weights (LoRA/checkpoints), workflow runs, "Workflow Templates" (read-only отображение ComfyUI-шаблонов + привязанных RunPod endpoint id)
- `/admin/chat/*` — Conversations (просмотр/тест чатов), Chat Prompt configs, Base Prompt config
- `/admin/user-space/*` — character-requests
- `/admin/system/*` — системные настройки (OpenRouter key, chat LLM model)

**Для фронтенда это не API-контракт** — HTML-страницы с формами и CSRF-токенами, предназначены для людей (админов/CRM), не для программной интеграции.

### 4.4 App API — `/api/app/v1/*` (приватный, для Next.js BFF) — Фаза 1

JSON API для конечных пользователей, но **вызывает его только Next.js-сервер**, не браузер. Код: `app/api/app/v1/*` (роутеры), `app/services/app_api.py` (логика), `app/api/app/v1/serialize.py` (сериализация в camelCase).

**Аутентификация — `require_internal_secret` (`app/deps.py`):**
- Каждый эндпоинт роутера требует заголовок `X-Internal-Secret`, равный `settings.internal_api_secret` (env `INTERNAL_API_SECRET`, плейсхолдер в `.env.example`). Сравнение constant-time (`hmac.compare_digest`). Нет заголовка или не совпал → `401`.
- Это **не** логин юзера. Identity живёт во фронте (Auth.js, `users.id` = uuid). Сюда бэк получает пользователя явно: `userId` в теле/квери (это `users.id` = Integer — доменная запись того же человека, **связка по email**). Ни JWT конечных юзеров, ни сессий, ни паролей здесь нет.
- Проверка принадлежности данных везде: `chat.user_id == userId`, иначе `403` (чужой чат) / `404` (нет чата). Один юзер не видит чужие чаты.
- Наружу отдаются только публичные данные: персонажи со `state="public"` и медиа с `is_public=true` (draft/hidden и приватные медиа не отдаются).

**Эндпоинты:**
- `POST /api/app/v1/users/ensure` — тело `{email, name?, image?, locale?, country?, googleSub?}`. Upsert `User` по email (provider `email`/`google`, при Google-входе бэкфиллит `google_sub`), гарантирует связанный `Account` (`plan_key=free`, `coins_balance=0`). `name/image/locale/country` принимаются, но **не хранятся** (профиль живёт во фронте — колонок под них нет, миграцию не добавляли). Ответ: `{userId, role:"user", account:{planKey, coinsBalance}}`.
- `GET /api/app/v1/characters?page=` — пагинированный список публичных персонажей + их публичные медиа.
- `GET /api/app/v1/characters/{handle}` — один публичный персонаж по `handle` + публичные медиа (иначе `404`).
- `GET /api/app/v1/me?userId=` — `{userId, planKey, coinsBalance, subscription|null}` для аккаунта юзера.
- `POST /api/app/v1/chats` — тело `{userId, characterId}` → создать/вернуть чат (идемпотентно: один чат на пару user+character).
- `POST /api/app/v1/chats/{chatId}/messages` — тело `{userId, content}` → мгновенно сохраняет user-сообщение (`chats.save_user_message`) и планирует фоновую генерацию ответа (`chats.generate_reply_isolated` через `BackgroundTasks`) — тот же флоу, что admin conversation UI. Ответ: `{message, status:"reply_pending"}`.
- `GET /api/app/v1/chats/{chatId}/messages?userId=` — сообщения чата (с проверкой принадлежности).

**Что переиспользовано:** `app/services/chats.py` (сохранение сообщения + фоновая генерация), `app/services/pagination.py`, модели `User`/`Account`/`CharacterProfile`/`CharacterMediaAsset`/`Chat`/`ChatMessage`/`Subscription`. Новых таблиц/колонок и Alembic-миграций не добавлялось. Тесты: `tests/test_app_api.py`.

---

## 5. Ключевые бизнес-флоу (как это работает изнутри)

### 5a. Чат с ИИ-персонажем
1. Сообщение пользователя сохраняется мгновенно (`chats.save_user_message`) — фронт видит его сразу.
2. Генерация ответа идёт в фоне (`FastAPI BackgroundTasks`) — не блокирует ответ на запрос.
3. Системный промпт собирается из: JSON-схемы ответа + `ChatPromptConfig.system_prefix_part` + жёстко закодированный блок модерации (запрет несовершеннолетних/джейлбрейков) + `BasePromptConfig.prompt` + `system_suffix_part` + `CharacterProfile.chat_system_prompt`.
4. LLM (через OpenRouter) отвечает строгим JSON: `{success, mino_detection, jail_break_detector, data: {answer, image_tag}, error}`. `image_tag` — выбор конкретного фото персонажа по его `prompt_tag` (энам, собранный из `CharacterMediaAsset`).
5. Если сработал флаг модерации — ответ подменяется на `ChatPromptConfig.violated_message`, а на предыдущем user-сообщении в `meta` ставится `violated: true`.
6. Полный raw JSON от LLM сохраняется в `ChatMessage.meta.raw` для аудита/отображения в админке.

Реализация: `app/services/chats.py`, `app/services/chat_prompt.py`, `app/services/openrouter.py`.

### 5b. Генерация изображений/видео персонажа
1. `WorkflowRun` создаётся из `GenWorkflow` (шаблон с шагами: profile_image → chat_image → video, шаги могут зависеть друг от друга через `depends_on`).
2. Каждый шаг при выполнении (`execute_step`) собирает промпт из деталей персонажа + `step_config`, берёт настройки чекпоинта/LoRA/resolution из привязанного `ImageWorkflowConfig`.
3. `RunPodGenerationProvider.generate(kind=..., prompt=..., config=...)` подставляет `{{PLACEHOLDER}}` токены в JSON ComfyUI-графа (файл на диске, выбор графа — по `config["workflow_template"]`), шлёт на RunPod Serverless endpoint (свой endpoint id на каждый шаблон — `main_sdxl`/`illustration`/`video`), поллит статус, скачивает результат, сохраняет в media storage.
4. Видео-шаг зависит от предыдущего image-шага (нужен стартовый кадр).

Реализация: `app/services/workflow_runs.py`, `app/services/gen_workflows.py`, `app/services/generation/runpod.py`.

### 5c. Биллинг
1. Оплата инициируется через `PaymentProvider` интерфейс (сейчас — `MockPaymentProvider`, в проде подключается реальный).
2. Провайдер шлёт вебхук на `/api/webhooks/{provider}` → обновляет `Transaction`/`Subscription` по `provider_*_id`.
3. `Account.coins_balance`/`plan_key` — источник правды для доступа к фичам; `CoinLedgerEntry` — аудит каждого изменения баланса.

---

## 6. Что фронтенд-агенту нужно решить/сделать

Так как публичного API нет, вероятная задача — спроектировать новый слой, например `app/api/public/v1/` или `app/api/app/v1/`, с:
- **Auth конечного пользователя**: регистрация/логин (email+пароль или Google OAuth callback → `google_sub`), выдача сессии/JWT, дальше — `current_user` dependency (по аналогии с `current_admin_api`, но для `User`, не `AdminUser`).
- **Каталог персонажей**: `GET /characters` (только `state=public` из `character_profiles`), с медиа из `character_media_assets` (учитывать `is_public`/`coin_amount` для платных фото).
- **Чат**: `POST /chats`, `POST /chats/{id}/messages` — переиспользовать `app/services/chats.py` (уже умеет async-генерацию через BackgroundTasks), но обернуть auth конечного пользователя, а не admin_id.
- **Профиль/баланс/подписка пользователя**: `GET /me` (из `Account`), покупка коинов/подписки — интеграция с `app/services/payments/`.
- **Заявки на генерацию персонажа**: уже есть модель `CharacterProfileRequest` — можно сделать `POST /character-requests` от имени пользователя.

Все нужные сервисные функции (чат, генерация, биллинг-модели) уже существуют в `app/services/*` — в большинстве случаев новый публичный роутер может напрямую их вызывать, только заменив admin-контекст на контекст обычного пользователя и добавив проверки принадлежности данных (`user_id` фильтры, чтобы пользователь не видел чужие чаты/заявки).
