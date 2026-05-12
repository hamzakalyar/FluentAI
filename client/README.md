# FluentAI Frontend | Speech Fluency Monitoring System

A premium, high-fidelity React frontend for the AI-Based Speech Fluency Monitoring & Practice System. Built with a clinical-grade aesthetic and professional HCI principles.

## 🚀 Tech Stack
- **Core**: React 18 + Vite
- **Styling**: Tailwind CSS 4 + Framer Motion (Micro-animations)
- **State Management**: Context API (Auth) + Custom Hooks (Recording)
- **Charts**: Recharts (High-performance SVG charting)
- **Icons**: Lucide React
- **Validation**: Zod + React Hook Form

## 🛠 Features
- **Recording Studio**: Real-time Web Audio API visualizer with a 5-state recording machine.
- **Deep Analytics**: Disfluency event tracking (repetitions, pauses) and phoneme proficiency ranking.
- **Transcript Engine**: Color-coded disfluency highlighting with metadata tooltips.
- **Practice Engine**: Targeted speech therapy exercises with micro-recording feedback loops.
- **Auth Flow**: 2-step registration, password strength metering, and protected route guards.

## 📂 Project Structure
- `src/components/shared`: Atomic UI components (Buttons, Inputs, Modals).
- `src/components/features`: Feature-specific logic (Waveforms, Charts).
- `src/context`: Global authentication and session state.
- `src/services`: API service layers for Node.js and Flask integration.
- `src/styles`: Tailwind 4 design tokens and global glassmorphism utilities.

## 🔌 Backend Integration
The frontend expects two services defined in `.env.local`:
- `VITE_API_BASE_URL`: Node.js/Express API (Auth, User Data, Session History).
- `VITE_AUDIO_SERVICE_URL`: Flask Audio Analysis API (Waveform processing, AI Transcript).

## 🎨 Design Tokens
Primary Palette:
- **Navy**: `#0F172A` (Slate-900) - Backgrounds & Headers
- **Primary**: `#4F46E5` (Indigo-600) - Actions & Branding
- **Teal**: `#0D9488` (Teal-600) - Success & Analytics
- **Amber**: `#D97706` (Amber-600) - Disfluency Markers

## 📝 HCI & Design Principles
- **Fitts' Law**: FAB implementation for common actions (New Recording).
- **Recognition over Recall**: Contextual tooltips for all data visualizations.
- **Aesthetic-Usability Effect**: Glassmorphism and staggered animations to enhance perceived trust.

---
Developed with ❤️ by the Frontend Team.
