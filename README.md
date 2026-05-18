# 🎤 FluentAI: AI-Based Speech Fluency Monitoring & Practice System

FluentAI is a state-of-the-art, clinically-informed speech therapy and diagnostic platform designed to help patients monitor, analyze, and rehabilitate speech disfluencies. By leveraging advanced Machine Learning pipelines (including Whisper phonetic alignment and Wav2Vec acoustic models), the system tracks syllable velocities, articulatory friction, blockages, prolongations, and repetitions in real-time, providing immediate therapist-grade diagnostic telemetry.

---

## 🏛️ System Architecture Overview

FluentAI is organized as a decoupled, high-availability microservices architecture consisting of three core layers:

```
┌────────────────────────┐
│     Vite + React       │ ◄─── (Port 5173: Rich Clinical UI & Recording Studio)
│       [client]         │
└──────────┬─────────────┘
           │ HTTP / Websockets
           ▼
┌────────────────────────┐
│    Express + Node      │ ◄─── (Port 3001: Patients, Sessions, telemetry database)
│       [server]         │
└──────────┬─────────────┘
           │ HTTP POST / REST
           ▼
┌────────────────────────┐
│     Python + Flask     │ ◄─── (Port 5000: Whisper, Wav2Vec, POS POS, spaCy NLP)
│    [audio-service]     │
└────────────────────────┘
```

### 📁 Consolidated Project Structure

* **[`client/`](file:///c:/Users/riazm/AI-Based-Speech-Fluency-Monitoring-Practice-System/client)**: Modern React/Vite SPA. Features glassmorphic dashboard telemetry, interactive session transcripts with speech-synthesis-driven audio sandbox, real-time waveform canvases, and our signature **Sound Focus Mode** engine.
* **[`server/`](file:///c:/Users/riazm/AI-Based-Speech-Fluency-Monitoring-Practice-System/server)**: Node.js/Express REST server. Handles clinical session persistence, session telemetry histories, HIPAA compliance logs, user profiles, notifications, and context-aware chat logs with the local MongoDB database.
* **[`audio-service/`](file:///c:/Users/riazm/AI-Based-Speech-Fluency-Monitoring-Practice-System/audio-service)**: Python speech analytics engine. Hosts Hugging Face model pipelines, custom syllable peaks detectors, and advanced text-alignment classifiers.

---

## 🚀 Advanced Clinical Features

### 1. Articulation & Phonetic Friction Map (`Analytics`)
* **Phoneme Trigger Matrix**: Graphically maps the frequencies of blockages and stutters across major English phonemes (such as dental fricatives `/th/`, bilabial plosives `/p/` & `/b/`, and consonant clusters `/str/`).
* **Trigger Words Telemetry**: Keeps real-time clinical frequency logs of specific vocabulary trigger words causing articulatory fatigue, paired with tactical pronunciation coaching tips.
* **Therapist Advisory Panel**: A dynamic clinical feedback module providing targeted verbal advice and exercises based on calculated telemetry patterns.

### 2. Practice Focus Mode & Targeted Drills (`Practice`)
* **Interactive Drill Matcher**: Instant redirection from the diagnostic friction map into customized speech rehabilitation sessions.
* **Sound Focus Mode notice**: Smoothly alerts the user that focus mode is active, serving custom plosive, fricative, and cluster drills while offering one-click reversals.
* **Mastery tracker**: Monitors and tracks improvement percentages across all consonant groups.

### 3. Context-Aware AI Clinical Assistant (`AI Assistant`)
* **Telemetry-Aware Guidance**: The chatbot integrates with the user's active database to summarize recent sessions, analyze improvement coefficients, and craft tailored tongue-twisters.
* **New Session Context Toggles**: Clear active dialogue streams with single-click actions, and toggle between detailed sidebar historical logs.

### 4. Interactive Visual Affordances & Alerts
* **Notification Drawer**: Displays unread clinical system notices, Whisper alignment milestones, and database synchronization validations.
* **Chevron State Toggles**: Provides rotating micro-animations on primary navigation hooks to guide visual hierarchy.

---

## 🧠 AI Models & Telemetry Mechanics

### 1. Whisper Phonetic Alignment
Our Python service employs OpenAI's **Whisper** model to generate word-level timestamped transcripts. We compare spoken acoustics against the target clinical passage to isolate and identify:
* **Repetitions**: Matching duplicate adjacent syllables.
* **Prolongations**: Identifying abnormal syllable durations in vocal tracts.
* **Fillers**: Flagging cognitive fillers (*"um"*, *"uh"*, *"ah"*, *"like"*).

### 2. Wav2Vec Syllable Peaking & Pause Analysis
Utilizing **Librosa** audio processing and **Wav2Vec 2.0** acoustic architectures, the system detects micro-pauses by calculating root-mean-square (RMS) energy envelopes and identifying silence durations between syllables to distinguish natural pauses from physical blockages.

---

## 🔒 HIPAA & Patient Privacy Standards
FluentAI is designed to uphold the highest standards of medical data security:
* **Anonymized Telemetry**: Audio recordings are processed inside secure, isolated sandboxes and automatically purged post-inference.
* **End-to-End Encryption**: Secure HTTP/REST protocol streams guarantee patient-to-server data encryption.
* **Audit Trails**: Detailed logs verify patient profile changes, session creation, and database sync activities.

---

## 🛠️ Step-by-Step Installation & Setup

### 📋 Prerequisites
* **Node.js** v18 or later
* **Python** v3.10 or later
* **MongoDB** (local community instance or Atlas cloud cluster)
* **FFmpeg** installed on your system PATH (required for audio conversion)

### 💻 Manual Configuration

#### 1. Server Configuration
```bash
cd server
npm install
# Create an .env file inside 'server/' with:
# PORT=3001
# MONGODB_URI=mongodb://localhost:27017/fluentai
# JWT_SECRET=your_jwt_secret_here
npm run dev
```

#### 2. Client Configuration
```bash
cd client
npm install
# Starts on http://localhost:5173
npm run dev
```

#### 3. Python Audio Service Configuration
```bash
cd audio-service
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
python app.py           # Starts on http://localhost:5000
```

---

## ⚡ Quickstart: The One-Command Startup Script

To simplify clinical orchestration, the repository contains a single, master startup script at the root: **[`START_ALL.bat`](file:///c:/Users/riazm/AI-Based-Speech-Fluency-Monitoring-Practice-System/START_ALL.bat)**.

Simply double-click the file or execute it in your terminal:
```cmd
.\START_ALL.bat
```
*The script will automatically clean up stale `__pycache__` and audio files, initialize all three services in isolated terminal shells, and launch the platform.*

---

## 👥 Clinical Development Team

* **Mudassir Riaz** (01-131232-046) — *Frontend Architecture & Patient Experience*
* **Hassan Ali** (01-131232-032) — *Backend Telemetry & Database Security*
* **M. Hamza Imtiaz** (01-131232-058) — *AI Audio Models & Acoustic Inference*

*Developed as a capstone application for BSE 6B.*
