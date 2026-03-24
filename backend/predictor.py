import hashlib
import random
from typing import Dict, Tuple

from breeds import BREEDS, BREED_DESCRIPTIONS


class MockBreedPredictor:
    """
    A deterministic mock predictor that maps image bytes to a breed and confidence.
    Useful for prototyping the end-to-end app without a real ML model.
    """

    def __init__(self) -> None:
        # In a real model, you might load weights here
        pass

    def predict(self, image_bytes: bytes) -> Tuple[str, float, str]:
        # Deterministic hash from image content
        digest = hashlib.sha256(image_bytes).digest()
        seed = int.from_bytes(digest[:8], "big", signed=False)
        rng = random.Random(seed)

        breed = rng.choice(BREEDS)
        # Confidence in a reasonable demo range
        confidence = round(rng.uniform(0.72, 0.98), 4)
        description = BREED_DESCRIPTIONS.get(breed, "No description available.")
        return breed, confidence, description
