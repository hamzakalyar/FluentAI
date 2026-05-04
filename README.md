# 🎤 AI-Based Speech Fluency Monitoring & Practice System

An AI-powered web platform that helps individuals monitor, analyze, and improve their speech fluency through automated stutter detection, linguistic analysis, and personalized practice exercises.

## 🚀 Features

- **Speech Recording** — Browser-based audio capture with real-time waveform visualization
- **AI Transcription** — Whisper-powered speech-to-text with word-level timestamps
- **Stutter Detection** — Automated detection of repetitions, abnormal pauses, fillers, and speech rate
- **NLP Analysis** — POS tagging, vocabulary complexity scoring, and avoidance behavior detection
- **Analytics Dashboard** — Interactive charts tracking fluency progress over time
- **Personalized Practice** — Exercises targeting your specific weak sounds and word types
- **Data Export** — Export session reports as PDF or DOCX

## 🏗️ Architecture

```
├── client/             # React Frontend (Vite + Tailwind CSS)
├── server/             # Node.js Backend (Express.js)
├── audio-service/      # Python Microservice (Flask + Whisper + Librosa + spaCy)
└── README.md
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | Node.js, Express.js, Sequelize ORM |
| Database | PostgreSQL (prod) / SQLite (dev) |
| AI/Audio | OpenAI Whisper, Librosa, spaCy, NLTK |
| Deployment | Vercel (frontend), Render (backend) |

## 📦 Setup

### Prerequisites
- Node.js 18+
- Python 3.10+
- PostgreSQL (optional, SQLite used for dev)

### Installation

```bash
# Clone the repo
git clone https://github.com/hamzakalyar/AI-Based-Speech-Fluency-Monitoring-Practice-System.git
cd AI-Based-Speech-Fluency-Monitoring-Practice-System

# Frontend
cd client
npm install
npm run dev

# Backend (new terminal)
cd server
npm install
npx nodemon src/app.js

# Audio Service (new terminal)
cd audio-service
pip install -r requirements.txt
python app.py
```

## 👥 Team

| Name | Enrollment | Role |
|------|-----------|------|
| Mudassir Riaz | 01-131232-046 | Frontend Development |
| Hassan Ali | 01-131232-032 | Backend Development |
| M. Hamza Imtiaz | 01-131232-058 | AI/Audio Service |

## 📄 License

This project is developed as part of the Web Engineering course (BSE 6B).
