import io
import json
import logging
import os
from datetime import datetime
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from PIL import Image, UnidentifiedImageError
from werkzeug.exceptions import RequestEntityTooLarge
from werkzeug.utils import secure_filename

from config import Config
from predictor import MockBreedPredictor
from breeds import BREEDS


app = Flask(__name__)
app.config.from_object(Config)

# Ensure folders exist
Path(app.config["UPLOAD_FOLDER"]).mkdir(parents=True, exist_ok=True)
Path(app.config["LOG_FOLDER"]).mkdir(parents=True, exist_ok=True)

# Configure logging to file and console
log_formatter = logging.Formatter(
    fmt="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
)
app_logger = logging.getLogger("backend")
app_logger.setLevel(logging.INFO)

file_handler = logging.FileHandler(os.path.join(app.config["LOG_FOLDER"], "app.log"))
file_handler.setFormatter(log_formatter)
app_logger.addHandler(file_handler)

console_handler = logging.StreamHandler()
console_handler.setFormatter(log_formatter)
app_logger.addHandler(console_handler)

# CORS setup
origins = [o.strip() for o in app.config["CORS_ORIGINS"].split(",") if o.strip()]
CORS(app, origins=origins)

predictor = MockBreedPredictor()


def allowed_file(filename: str) -> bool:
    if not filename or "." not in filename:
        return False
    ext = filename.rsplit(".", 1)[1].lower()
    return ext in app.config["ALLOWED_EXTENSIONS"]


@app.errorhandler(RequestEntityTooLarge)
def handle_large_file(e):
    return (
        jsonify({
            "error": "file_too_large",
            "message": f"File exceeds the maximum allowed size of {app.config['MAX_UPLOAD_MB']} MB.",
        }),
        413,
    )


@app.errorhandler(Exception)
def handle_exception(e):
    app_logger.exception("Unhandled exception: %s", str(e))
    return jsonify({"error": "internal_error", "message": "An unexpected error occurred."}), 500


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "message": "API is healthy",
        "time": datetime.utcnow().isoformat() + "Z",
    })


@app.get("/breeds")
def list_breeds():
    return jsonify({"breeds": BREEDS})


@app.post("/predict")
def predict():
    # Input validation
    if "image" not in request.files:
        return jsonify({"error": "missing_file", "message": "No file part named 'image'."}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "empty_filename", "message": "No selected file."}), 400

    filename = secure_filename(file.filename)
    app_logger.info(f"Processing file: {filename}")

    if not allowed_file(filename):
        return (
            jsonify({
                "error": "invalid_type",
                "message": f"Unsupported file type. Allowed: {sorted(app.config['ALLOWED_EXTENSIONS'])}",
            }),
            400,
        )

    # Read file content
    try:
        file_bytes = file.read()
        size_bytes = len(file_bytes)
        
        if size_bytes == 0:
            return jsonify({"error": "empty_file", "message": "Uploaded file is empty."}), 400
            
        # Reset file pointer
        file.seek(0)
        
        # Validate image content
        with Image.open(io.BytesIO(file_bytes)) as img:
            img.verify()  # quick sanity check
            
    except UnidentifiedImageError as e:
        app_logger.error(f"Invalid image format: {str(e)}")
        return jsonify({"error": "invalid_image", "message": "Uploaded file is not a valid image."}), 400
    except Exception as e:
        app_logger.error(f"Error processing image: {str(e)}")
        return jsonify({"error": "processing_error", "message": f"Error processing image: {str(e)}"}), 400

    # Predict using mock model
    try:
        breed, confidence, description = predictor.predict(file_bytes)
    except Exception as e:
        app_logger.error(f"Prediction error: {str(e)}")
        return jsonify({"error": "prediction_error", "message": "Error during breed prediction."}), 500

    app_logger.info(
        "Prediction | file=%s size=%d bytes | breed=%s conf=%.3f",
        filename,
        size_bytes,
        breed,
        confidence,
    )

    return jsonify({
        "breed": breed,
        "confidence": confidence,
        "description": description,
        "filename": filename,
        "size_bytes": size_bytes,
    })


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=app.config["DEBUG"])  # nosec: B104
