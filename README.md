# Cattle Breed Predictor 🐄

A specialized machine learning application utilizing a React frontend and a Flask backend to allow users to upload images of cattle or buffalo and instantly receive a prediction about their breed, confidence score, and breed characteristics.

## 🚀 Features

- **Intuitive UI:** A clean, responsive React interface powered by Tailwind CSS allowing drag-and-drop image uploads (`UploadArea.jsx`).
- **Real-Time Prediction:** Instant processing of images showing both the prediction and a curated description of the breed (`ResultCard.jsx`).
- **RESTful API:** A Flask-powered backend featuring endpoints `/health`, `/breeds`, and `/predict` with comprehensive error handling for large files or invalid formats.
- **Image Validation:** Validates byte arrays using Pillow (PIL) before attempting predictions to ensure security and stability.

## 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS (Responsive utility classes), Axios
- **Backend:** Python 3, Flask, Flask-CORS, Pillow (Image Processing)
- **Model:** Currently uses a `MockBreedPredictor` class representing the ML prediction layer architecture.

## 🛠️ Folder Structure

- `backend/app.py`: The main Flask server application handling routes and CORS.
- `backend/breeds.py`: The dictionary mapping breed names to their biological profiles.
- `frontend/src/`: Contains the React components, Context, and Tailwind configurations (`tailwind.config.js`).

## ⚙️ Local Development

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
python app.py
```

*The Flask server defaults to running on port 5000.*

### Frontend Setup

```bash
cd frontend
npm install
npm run start
```

*The React development server runs automatically on <http://localhost:3000>.*
