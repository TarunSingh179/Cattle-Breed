# Cattle Breed Predictor 🐄

An AI-powered application designed to identify and predict cattle and buffalo breeds from images. It uses a React frontend for the user interface and a Flask Python backend to process images and perform breed classification.

## 🚀 Features

- **Image Upload:** Users can upload images of cattle/buffalo easily via a drag-and-drop interface.
- **Breed Prediction:** Quickly identifies the breed with a confidence score.
- **Detailed Information:** Provides a brief description of the detected breed's characteristics.
- **Fully Responsive:** Beautifully designed UI that works perfectly across mobile, tablet, and desktop screens.

## 💻 Tech Stack

- **Frontend:** React.js, Tailwind CSS
- **Backend:** Flask, Python (Pillow for image processing)

## 🛠️ Installation & Setup

### Prerequisites

- Node.js & npm (for the frontend)
- Python 3.x & pip (for the backend)

### Backend Setup

1. Navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install the required Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   *The server runs on http://localhost:5000*

### Frontend Setup

1. Open a new terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install the Node dependencies:
   ```bash
   npm install
   ```
3. Start the React development server:
   ```bash
   npm start
   ```
   *The app will automatically open at http://localhost:3000*

## 📁 Project Structure

- `backend/`: Contains the Flask server, prediction logic, and configuration.
- `frontend/`: Contains the React UI components, Tailwind styling, and API connections.
- `test_images/`: A collection of sample images used for testing breed detection.
