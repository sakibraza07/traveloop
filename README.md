# 🎙 EmoSense AI — Voice Emotion Detection

> Record your voice. Understand your emotion. Get intelligent feedback.

EmoSense AI is a full-stack machine learning web application that detects human emotions from voice recordings in real time. It uses a trained neural network on the RAVDESS dataset to classify 8 emotions from audio features extracted using Librosa.

---

## 🚀 Live Demo

> Run locally — see setup instructions below.

---

## 📸 Screenshot

![EmoSense AI Screenshot](static/screenshot.png)

---

## 🧠 How It Works

1. User records their voice via the browser microphone
2. Audio is sent to a Flask REST API as a `.webm` file
3. Backend extracts **MFCC**, **Chroma**, and **Mel Spectrogram** features using Librosa
4. Features are scaled and passed to a trained **MLPClassifier** neural network
5. Detected emotion and personalized feedback are returned as JSON
6. Frontend displays the result instantly

---

## 🎯 Model Performance

| Metric | Value |
|--------|-------|
| Dataset | RAVDESS (24 actors, 1440 audio files) |
| Features | MFCC (40) + Chroma (12) + Mel Spectrogram (128) = 180 features |
| Model | MLPClassifier — hidden layers (256, 128) |
| Accuracy | **72.92%** on 20% test split |
| Emotions | Neutral, Calm, Happy, Sad, Angry, Fearful, Disgust, Surprised |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript (Web Audio API) |
| Backend | Python, Flask, Flask-CORS |
| ML / Audio | Librosa, Scikit-learn, NumPy |
| Model | MLPClassifier (scikit-learn) |
| Audio Processing | ffmpeg, soundfile |

---

## 📁 Project Structure

```
voice_emotion_app/
├── app.py                  # Flask application entry point
├── config.py               # Path configuration
├── requirements.txt        # Python dependencies
├── .env                    # Environment variables
├── .gitignore
│
├── models/
│   ├── model.pkl           # Trained MLPClassifier
│   └── scaler.pkl          # StandardScaler
│
├── services/
│   ├── emotion_service.py  # Prediction logic
│   └── feedback_service.py # Feedback generation
│
├── utils/
│   └── audio_features.py   # MFCC/Chroma/Mel extraction
│
├── templates/
│   └── index.html          # Frontend UI
│
└── training/
    ├── train_model.py       # Model training script
    └── preprocessing.py    # Feature extraction from RAVDESS
```

---

## ⚙️ Setup & Run Locally

### Prerequisites
- Python 3.10+
- ffmpeg installed (`brew install ffmpeg` on Mac)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/sakibraza07/emosense-ai.git
cd emosense-ai

# 2. Install Python dependencies
pip3 install -r requirements.txt

# 3. Run the Flask server
python3 app.py

# 4. Open in browser
# Go to http://127.0.0.1:5000
```

---

## 🔁 Retrain the Model (Optional)

If you want to retrain using your own RAVDESS dataset:

```bash
# Step 1 — Extract features from dataset
python3 training/preprocessing.py

# Step 2 — Train and save the model
python3 training/train_model.py
```

> ⚠️ The RAVDESS dataset is NOT included in this repo. Download it from [Zenodo](https://zenodo.org/record/1188976).

---

## 🌱 Future Improvements

- [ ] Add user authentication and history tracking
- [ ] Deploy to cloud (Render / Railway)
- [ ] Improve model accuracy with deep learning (CNN on spectrograms)
- [ ] Add real-time streaming emotion detection
- [ ] Support multiple languages

---

## 👤 Author

**Sakib Raza**  
B.Tech Computer Science & Engineering  
GitHub: [@sakibraza07](https://github.com/sakibraza07)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
