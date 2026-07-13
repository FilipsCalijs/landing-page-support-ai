from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# backend/ — var/* defaults are anchored here so they resolve the same way regardless
# of the process's current working directory (uvicorn vs. `python scripts/seed.py`).
BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    # Reads backend/.env or the repo-root .env, whichever is present (root wins).
    model_config = SettingsConfigDict(
        env_file=(".env", "../.env"), env_file_encoding="utf-8", extra="ignore"
    )

    env: str = "dev"
    secret_key: str = "dev-secret-change-me"
    database_url: str = "postgresql+asyncpg://sweat:sweat@localhost:5433/sweat"
    redis_url: str = "redis://localhost:6380/0"

    project_name: str = "Sweat Companion"
    main_host: str = "sweatcompanion.com"

    # All timestamps are stored/generated in UTC; this only controls how the admin UI
    # (Jinja's `dt` filter) displays them. IANA name, e.g. "Europe/Riga".
    display_timezone: str = "Europe/Riga"

    # Admin sessions
    session_cookie_name: str = "sc_admin_session"
    session_ttl_seconds: int = 12 * 3600
    cookie_secure: bool = False

    # Rate limits (requests per window)
    rate_limit_general: int = 240
    rate_limit_general_window: int = 60
    rate_limit_login: int = 5
    rate_limit_login_window: int = 60

    # Impersonation token lifetime
    impersonation_ttl_seconds: int = 15 * 60

    # Shared secret for the private app API (app/api/app/v1/*). The Next.js server
    # (BFF) sends it as the X-Internal-Secret header; the browser never calls this
    # backend directly. End-user identity lives in the frontend (Auth.js) and is
    # passed to us explicitly — this secret only proves the caller IS the frontend.
    internal_api_secret: str = "change-me-shared-with-frontend"

    # Seed admin
    admin_seed_email: str = "admin@sweatcompanion.com"
    admin_seed_password: str = "admin12345"

    # Static FX rates to USD for MRR normalization (MVP)
    fx_rates_to_usd: dict[str, float] = {"USD": 1.0, "EUR": 1.08, "GBP": 1.27, "INR": 0.012}

    payment_provider: str = "mock"
    mock_webhook_secret: str = "mock-webhook-secret"

    # Weights storage: "local" (dev stub) or "s3" (prod, needs the s3_* settings)
    weights_storage: str = "local"
    weights_dir: str = str(BASE_DIR / "var" / "weights")
    s3_bucket: str = ""
    s3_region: str = ""
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""

    # Generated media (workflow run output): same local/s3 split as weights storage
    media_storage: str = "local"
    media_dir: str = str(BASE_DIR / "var" / "media")
    media_url_prefix: str = "/media"

    # Generation backend: "stub" draws placeholder images until a real ComfyUI/API
    # pipeline is wired up. Set to "runpod" once the endpoint below is deployed.
    generation_provider: str = "stub"

    # RunPod Serverless (ComfyUI worker) — from the endpoint's dashboard.
    # Each ComfyUI graph variant (image workflow_template key, or "video") runs on its own
    # endpoint/custom Docker image, so each gets its own endpoint id — see
    # app.services.generation.runpod._image_workflow_endpoint_registry() for the mapping.
    runpod_api_key: str = ""
    runpod_endpoint_id: str = ""
    runpod_endpoint_id_illustration: str = ""
    runpod_endpoint_id_video: str = ""
    runpod_poll_interval_seconds: float = 2.0
    runpod_poll_timeout_seconds: float = 180.0
    # Video (WAN 2.2 + RIFE interpolation + upscale) routinely takes 3-5 minutes end to
    # end once queue delay is included — the image timeout above is tuned for the much
    # faster SDXL+FaceDetailer pipeline and cuts video jobs off before RunPod finishes.
    runpod_poll_timeout_seconds_video: float = 600.0
    # Path to the exported ComfyUI "Save (API Format)" workflow, with {{PLACEHOLDER}}
    # tokens substituted in for prompt/checkpoint/lora/seed before each request.
    runpod_workflow_template_path: str = str(
        BASE_DIR / "app" / "services" / "generation" / "runpod_workflow_template.json"
    )
    # "illustration" workflow_template variant — same token set as the default template
    # (minus LoRA, that graph has none) but a different checkpoint/graph shape, so it
    # runs on its own RunPod endpoint (runpod_endpoint_id_illustration).
    runpod_workflow_template_illustration_path: str = str(
        BASE_DIR / "app" / "services" / "generation" / "runpod_workflow_template_illustration.json"
    )
    # Separate template for kind == "video" (WAN 2.2 image-to-video) — different graph
    # shape entirely, so it isn't just another set of tokens on the image template.
    runpod_workflow_template_video_path: str = str(
        BASE_DIR / "app" / "services" / "generation" / "runpod_workflow_template_video.json"
    )

    # RunPod Network Volume, mirrored from our own weights storage via its S3-compatible
    # API so ComfyUI reads models locally instead of downloading them per generation.
    # Settings page -> S3 API Keys (separate from runpod_api_key above).
    runpod_volume_id: str = ""
    runpod_datacenter: str = ""  # e.g. "EUR-IS-1" — must match the volume + endpoint's DC
    runpod_s3_access_key_id: str = ""
    runpod_s3_secret_access_key: str = ""


@lru_cache
def get_settings() -> Settings:
    return Settings()
