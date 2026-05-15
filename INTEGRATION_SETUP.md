# Frontend ↔ Backend Integration Setup Guide

This guide walks you through setting up and running the complete system with all services integrated.

## System Architecture

```
Frontend (React/Vite)
    ↓ API calls ↓
Backend (Express/Node.js)
    ↓ Audio processing ↓
Python Audio Service (Flask)
    ↓ Results ↓
Backend → MongoDB
    ↓ Returns JSON ↓
Frontend (display results)
```

## Prerequisites

- **Node.js** (v16+) — for both frontend and backend
- **Python** (3.8+) — for audio processing service
- **MongoDB** — local or Atlas connection string
- **FFmpeg** — for audio processing (optional, the service will auto-download if missing)

---

## Setup Instructions

### 1. Backend Setup

```bash
cd server
npm install
```

**Create `.env` file** in the `server/` directory:
```
PORT=3001
MONGODB_URI=mongodb+srv://<your-username>:<your-password>@cluster.xxxxx.mongodb.net/speech-fluency?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-key-change-this-in-production
PYTHON_SERVICE_URL=http://localhost:5000
CLIENT_URL=http://localhost:5173
```

**Start the backend:**
```bash
npm start
# Backend runs on http://localhost:3001
```

---

### 2. Python Audio Service Setup

```bash
cd audio-service
pip install -r requirements.txt
```

**Optional: Create `.env` file** (not required, but good for future expansion):
```
FLASK_PORT=5000
FLASK_ENV=development
```

**Start the Python service:**
```bash
python app.py
# Service runs on http://localhost:5000
```

This will:
- Auto-download Whisper model (~140MB, first time only)
- Download spaCy English model (~50MB, first time only)
- Initialize all required NLP components
- Start listening on port 5000

---

### 3. Frontend Setup

```bash
cd client
npm install
```

**Start the frontend dev server:**
```bash
npm run dev
# Frontend runs on http://localhost:5173
```

---

## Running the Complete System

You need **3 terminal windows**:

**Terminal 1 — Backend:**
```bash
cd server && npm start
```

**Terminal 2 — Python Service:**
```bash
cd audio-service && python app.py
```

**Terminal 3 — Frontend:**
```bash
cd client && npm run dev
```

Then open: **http://localhost:5173**

---

## Windows Users — One-Command Startup (Optional)

Create a file named `START_ALL.bat` in the project root:

```batch
@echo off
echo Starting all services...

REM Terminal 1: Backend
start cmd /k "cd server && npm start"

REM Terminal 2: Python Service
start cmd /k "cd audio-service && python app.py"

REM Terminal 3: Frontend (with small delay)
timeout /t 3 > nul
start cmd /k "cd client && npm run dev"

echo.
echo ========================================
echo All services starting...
echo Backend:  http://localhost:3001
echo Python:   http://localhost:5000
echo Frontend: http://localhost:5173
echo ========================================
echo When ready, open http://localhost:5173 in your browser
pause
```

Then just double-click `START_ALL.bat` to launch everything.

---

## Integration Status ✅

| Component | Status | Details |
|-----------|--------|---------|
| **Authentication** | ✅ | Real login/register, token rehydration on refresh |
| **Dashboard** | ✅ | Real data from MongoDB sessions |
| **Analytics** | ✅ | Real analytics APIs + charts |
| **Recording Studio** | ✅ | Records audio → sends to Python service → saves to MongoDB |
| **Practice** | ✅ | Generates exercises from weak sounds → tracks results |
| **Auth Endpoints** | ✅ | Verify email, forgot password, reset password (stub) |
| **Role-Based Access** | ✅ | Patient/Admin roles supported |

---

## Verification Checklist

After starting all services, verify each flow:

### ✅ Authentication Flow
1. Go to **Sign Up** page
2. Register with test credentials:
   - Name: `Test User`
   - Email: `test@example.com`
   - Password: `123456`
   - Role: `Patient`
3. You should be logged in to Dashboard
4. **Refresh the page** — you should stay logged in (token rehydrated)
5. Click **Logout** and verify you're redirected to landing page

### ✅ Recording Studio Flow
1. Go to **Recording Studio** (requires authentication)
2. Click **Start Recording**
3. Speak for 5-10 seconds (test phrase: "The sun is shining brightly")
4. Click **Stop Recording**
5. Click **Analyze** and **wait** (Whisper can take 30-60 seconds)
6. You should see:
   - Transcript of what you said
   - Speech metrics (WPM, fluency score, stuttering indicators)
   - Weak sounds identified
7. You're redirected to **Session Detail** page

### ✅ Dashboard Flow
1. After completing a recording, go to **Dashboard**
2. You should see:
   - "Total Sessions: 1"
   - "Avg Fluency Score: XX%"
   - Your recent session listed
3. If you completed multiple sessions, the chart should show trend data

### ✅ Analytics Flow
1. After 2-3 recordings, go to **Analytics**
2. You should see:
   - Summary stats (same as dashboard)
   - WPM trend line chart
   - Weak sounds breakdown
3. Try changing the **date range** (7d, 30d, etc.)

### ✅ Practice Flow
1. After at least one analysis session, go to **Practice**
2. You should see exercises generated for your weak sounds
3. Click **Start Recording** on an exercise
4. Speak the sentence
5. Click **Mark Complete** to save the practice result

---

## Troubleshooting

### "Python service not responding"
- Verify Python service is running: `http://localhost:5000/health`
- Check Python terminal for error messages
- Common issues:
  - Missing spaCy model: Run `python -m spacy download en_core_web_sm`
  - Missing NLTK data: First Whisper load downloads ~500MB

### "MongoDB connection failed"
- Verify `MONGODB_URI` in `.env`
- Check if you have internet access (for MongoDB Atlas)
- Local MongoDB: Install locally or use Docker: `docker run -d -p 27017:27017 mongo`

### "Frontend shows 'Loading' forever"
- Open browser DevTools (F12) → Console
- Look for API errors
- Ensure backend is running on 3001
- Check backend logs for errors

### "Audio recording fails"
- Check browser permissions for microphone (🔒 icon in URL bar)
- Ensure HTTPS (or localhost for HTTP) — browsers require secure context

### "FFmpeg not found"
- The service will auto-download it
- If it fails, download manually from https://ffmpeg.org/download.html
- Or run: `python audio-service/download_ffmpeg.py`

---

## Next Steps (Optional Enhancements)

1. **Email Service**: Replace stub endpoints with real Sendgrid/AWS SES integration
2. **Deployment**: Deploy to Azure (backend on App Service, frontend on Static Web App)
3. **Admin Dashboard**: Implement clinician views for patient management
4. **Mobile**: Add mobile app using React Native or Expo

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Login
- `GET /api/auth/me` — Get current user
- `PUT /api/auth/profile` — Update profile
- `POST /api/auth/verify-email` — Verify email (stub)
- `POST /api/auth/forgot-password` — Request password reset (stub)
- `POST /api/auth/reset-password` — Reset password (stub)

### Sessions (Recording)
- `POST /api/sessions/analyze` — Upload audio & analyze
- `GET /api/sessions` — List user's sessions
- `GET /api/sessions/:id` — Get session details
- `GET /api/sessions/stats/summary` — Get summary stats
- `DELETE /api/sessions/:id` — Delete session

### Practice
- `POST /api/practice/generate` — Generate exercises
- `POST /api/practice/results` — Save practice result
- `GET /api/practice/results` — Get practice history

### Analytics
- `GET /api/analytics/summary` — Get analytics summary
- `GET /api/analytics/trend` — Get trend data
- `GET /api/analytics/weak-sounds` — Get weak sounds

---

## Questions?

Check:
1. Backend logs for Express errors
2. Python service terminal for Flask errors
3. Browser DevTools Console (F12) for frontend errors
4. Check that all 3 services are running (use `netstat -an | find "3001"` or similar)
