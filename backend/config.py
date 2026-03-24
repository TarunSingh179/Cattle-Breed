import os
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent


class Config:
    # Max upload size in MB (enforced by Flask automatically)
    MAX_UPLOAD_MB = int(os.getenv("MAX_UPLOAD_MB", "8"))
    MAX_CONTENT_LENGTH = MAX_UPLOAD_MB * 1024 * 1024

    # Where to store temporary uploads/logs (local dev)
    UPLOAD_FOLDER = str(BASE_DIR / "uploads")
    LOG_FOLDER = str(BASE_DIR / "logs")

    # Allowed image extensions
    ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "webp", "bmp", "tiff", "tif"}

    # CORS origins (comma-separated)
    CORS_ORIGINS = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000",
    )

    DEBUG = os.getenv("FLASK_DEBUG", "false").lower() in {"1", "true", "yes"}
    JSONIFY_PRETTYPRINT_REGULAR = False
    JSON_SORT_KEYS = True
