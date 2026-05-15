# SpeakFlow: AI-Based Speech Fluency Monitoring & Practice System
**Comprehensive Project Documentation & Defense Guide**

---

## 1. Project Overview
This project is an advanced, full-stack web application designed to help individuals monitor, analyze, and practice their speech fluency. The system uses a microservice architecture to record audio, process it using state-of-the-art Deep Learning models, and provide actionable feedback on stuttering (blocks, prolongations, repetitions) and pronunciation.

### The Architecture
The project is divided into three main components:
1. **Frontend (`client/`)**: Built with React (Vite) and TailwindCSS. It provides the user interface, including the Recording Studio where users practice passages and view visual feedback.
2. **Backend Server (`server/`)**: Built with Node.js, Express, and MongoDB. It handles user authentication, stores historical session data, and manages practice results.
3. **AI Audio Service (`audio-service/`)**: Built with Python and Flask. This is the "brain" of the project, executing deep learning models (Whisper and Stutter-Solver) to analyze incoming audio recordings.

---

## 2. Requirements to Run the Project

To successfully run this system locally, you must have the following installed:

### System Dependencies
- **Node.js** (v16+) & **npm**: Required to run the React client and Express server.
- **Python 3.12**: Required for the AI microservice.
- **FFmpeg**: Required on your system path to process `.webm` audio files from the browser.
- **MongoDB**: A running local instance or MongoDB Atlas URI.

### Step-by-Step Execution
1. **Database & Node Server**
   ```bash
   cd server
   npm install
   # Ensure your .env file is set up with MongoDB credentials
   npm run dev
   ```
2. **React Client**
   ```bash
   cd client
   npm install
   npm run dev
   ```
3. **Python AI Service**
   ```powershell
   cd audio-service
   # Activate virtual environment
   .\venv\Scripts\Activate.ps1
   # Install dependencies (if not already done)
   pip install -r requirements.txt torchaudio librosa
   # Start the AI server
   python app.py
   ```
4. **Test Frontend (Alternative / Demo UI)**
   ```bash
   cd test-frontend
   # Serve the static files using npx
   npx -y serve .
   ```

---

## 3. What Has Been Added Recently
The system was recently overhauled to replace basic heuristic audio analysis with cutting-edge Deep Learning. The recent additions include:

* **Stutter-Solver Integration (`stutter_solver_service.py`)**: A dedicated service wrapper that loads the deep learning VITS models directly into memory.
* **Audio Preprocessing Pipeline**: Automatic downsampling of browser audio to strictly `22.05kHz` and conversion to mel-spectrograms required by the AI.
* **Algorithm Data Fusion (`stutter_detector.py`)**: A complex `merge_transcript_and_stutters` algorithm that perfectly synchronizes the millisecond timestamps from the Stutter-Solver AI with the word-level boundaries produced by OpenAI's Whisper model.
* **Frontend Visualization Updates**: The React `RecordingStudio.jsx` was updated to consume the new `detectedStutters` array, visually highlighting specific dysfluent words and breaking down the stutter type (e.g., Block, Prolongation) and exact timestamp.

---

## 4. Detailed Notes on Our Deep Learning Model (For Defense)

### A. What is the Model?
We are using the **Stutter-Solver**, a deep learning model structurally based on the **VITS** (Variational Inference with adversarial learning for end-to-end Text-to-Speech) architecture. It utilizes a `SynthesizerTrn` and an attention-based decoder to map acoustic features directly to dysfluency boundaries.

### B. Where is it Placed in the Architecture?
The model is placed securely inside the **`audio-service` Python microservice**. 
When audio arrives at the `/analyze` endpoint, the system splits the task into a **parallel pipeline**:
1. **Branch 1 (Text & Alignment)**: The audio is sent to OpenAI's Whisper model to generate an accurate text transcript with word-level start/end times.
2. **Branch 2 (Acoustic Stutter Detection)**: The audio is sent to the Stutter-Solver model, which skips the text entirely and looks strictly at the audio waves (mel-spectrograms) to detect acoustic anomalies (blocks, repetitions).
3. **Fusion**: The two branches meet back in `stutter_detector.py`, where the AI's acoustic timestamps are layered directly on top of Whisper's words.

### C. How to Defend the Model (Defense Strategy & Talking Points)

If examiners ask *why* you chose this approach and *why it's better* than traditional systems, use these defense points:

**1. The "Acoustic vs. Lexical" Defense (Why not just use Whisper?)**
* *Argument*: Traditional Speech-to-Text models (like Whisper or Google Speech) are trained to *ignore* stuttering. They are "lexical" models designed to clean up messy audio and output perfect text. If a user has a 2-second silent block, Whisper just skips it.
* *Defense*: Our system uses Stutter-Solver because it performs **Acoustic Analysis**. By looking at the mel-spectrogram (visual representation of the audio frequencies), the deep learning model detects *how* the person is speaking, not just *what* they are saying, allowing us to catch invisible dysfluencies like blocks and prolongations.

**2. The Precision Defense (Why Deep Learning over Heuristics?)**
* *Argument*: Older fluency apps use simple heuristic math (e.g., "if silence > 1 second, it's a pause").
* *Defense*: Human speech is highly dynamic. A 1-second pause could be a stuttering block, or it could just be taking a breath between sentences. By using the Stutter-Solver's Soft-Attention mechanisms, our neural network has *learned* the acoustic signature of a real stuttering block versus a natural pause, drastically reducing false positives.

**3. The Synchronization Defense (The Architectural Achievement)**
* *Argument*: How do you link raw audio signals to text on the screen?
* *Defense*: We engineered a custom Data Fusion algorithm. Because our Stutter-Solver model predicts dysfluencies in precise milliseconds, and our Whisper model provides word boundaries in milliseconds, we intersect the two arrays. This allows our frontend to dynamically highlight the exact word the user struggled on, creating an unparalleled, user-friendly feedback loop.
