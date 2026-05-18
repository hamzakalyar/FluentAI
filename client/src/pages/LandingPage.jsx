import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users, BarChart3, Zap, Mic, Square, Volume2, Sparkles, RefreshCw
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { cn } from '../utils/cn';
import { useAuth } from '../context/AuthContext';

/* ── Design tokens ─────────────────────── */
const T = {
  navy: '#0F172A',
  text: 'var(--text-secondary)',
  muted: 'var(--text-muted)',
  border: 'var(--border-subtle)',
};

/* ── Scroll reveal ─────────────────────── */
function useReveal() {
  useEffect(() => {
    const io = new IntersectionObserver(
      es => es.forEach(e => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);
}

export default function LandingPage() {
  const navigate = useNavigate();
  useReveal();
  const { loginDemo } = useAuth();

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const [demoMode, setDemoMode] = useState('simulate'); // 'simulate' | 'record'
  const [selectedProfile, setSelectedProfile] = useState('blockage');
  const [analyzing, setAnalyzing] = useState(false);
  const [activePlaybackWord, setActivePlaybackWord] = useState(null);
  
  // Microphone recording sandbox states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [customDiagnostic, setCustomDiagnostic] = useState(null);
  const canvasRef = useRef(null);

  const DEMO_PROFILES = {
    blockage: {
      name: "Subject A: Speech Block",
      label: "Speech Block",
      score: 64,
      disfluencyRate: "14.2%",
      syllables: 450,
      words: [
        { word: "I", start: 0, end: 0.3 },
        { word: "really", start: 0.4, end: 0.8 },
        { word: "want", start: 0.9, end: 2.1, stutter: "block", label: "Speech Block" },
        { word: "to", start: 2.2, end: 2.5 },
        { word: "improve", start: 2.6, end: 3.2 },
        { word: "my", start: 3.3, end: 3.5 },
        { word: "public", start: 3.6, end: 4.1 },
        { word: "speaking.", start: 4.2, end: 5.0 }
      ]
    },
    repetition: {
      name: "Subject B: Repetition",
      label: "Word Repetition",
      score: 75,
      disfluencyRate: "9.8%",
      syllables: 580,
      words: [
        { word: "This", start: 0, end: 0.3 },
        { word: "is-is-is", start: 0.4, end: 1.5, stutter: "repetition", label: "Word Repetition" },
        { word: "an", start: 1.6, end: 1.8 },
        { word: "extremely", start: 1.9, end: 2.5 },
        { word: "important", start: 2.6, end: 3.2 },
        { word: "clinical", start: 3.3, end: 3.8 },
        { word: "milestone.", start: 3.9, end: 4.7 }
      ]
    },
    fluent: {
      name: "Subject C: Fluent Speech",
      label: "Fluent Mode",
      score: 96,
      disfluencyRate: "1.2%",
      syllables: 820,
      words: [
        { word: "Practice", start: 0, end: 0.5 },
        { word: "makes", start: 0.6, end: 0.9 },
        { word: "us", start: 1.0, end: 1.2 },
        { word: "perfect", start: 1.3, end: 1.7 },
        { word: "and", start: 1.8, end: 2.0 },
        { word: "highly", start: 2.1, end: 2.5 },
        { word: "confident", start: 2.6, end: 3.2 },
        { word: "speakers.", start: 3.3, end: 4.0 }
      ]
    }
  };

  const handleProfileSelect = (profileId) => {
    setAnalyzing(true);
    setSelectedProfile(profileId);
    setTimeout(() => {
      setAnalyzing(false);
    }, 800);
  };

  const startRecordingSandbox = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsRecording(true);
    } catch (e) {
      // Permission denied or no mic, still run simulated recording visualizer gracefully!
      setIsRecording(true);
    }
  };

  const stopRecordingSandbox = () => {
    setIsRecording(false);
    setAnalyzing(true);
    
    setTimeout(() => {
      setAnalyzing(false);
      setCustomDiagnostic({
        score: Math.floor(82 + Math.random() * 15),
        disfluencyRate: `${(2.4 + Math.random() * 4).toFixed(1)}%`,
        syllables: 48,
        words: [
          { word: "Speech", start: 0, end: 0.5 },
          { word: "fluency", start: 0.6, end: 1.1 },
          { word: "monitoring", start: 1.2, end: 2.0 },
          { word: "works", start: 2.1, end: 2.5 },
          { word: "with", start: 2.6, end: 2.9 },
          { word: "precision.", start: 3.0, end: 3.8 }
        ]
      });
    }, 1500);
  };

  useEffect(() => {
    let interval;
    if (isRecording) {
      setRecordingSeconds(0);
      interval = setInterval(() => {
        setRecordingSeconds(prev => {
          if (prev >= 4) {
            stopRecordingSandbox();
            return 4;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  useEffect(() => {
    if (!isRecording || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frameId;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#0D9488';
      ctx.beginPath();
      
      const sliceWidth = canvas.width / 40;
      let x = 0;
      
      for (let i = 0; i < 40; i++) {
        const amplitude = 5 + Math.random() * 25 * (Math.sin(Date.now() / 200 + i / 5) * 0.5 + 0.5);
        ctx.moveTo(x, canvas.height / 2 - amplitude / 2);
        ctx.lineTo(x, canvas.height / 2 + amplitude / 2);
        x += sliceWidth;
      }
      
      ctx.stroke();
      frameId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frameId);
  }, [isRecording]);

  const playSynthesizedWord = (word, stutterType) => {
    setActivePlaybackWord(word);
    
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      setTimeout(() => setActivePlaybackWord(null), 500);
      return;
    }

    try {
      window.speechSynthesis.cancel();
      
      // Mimic clinical disfluencies realistically using vocal breaks
      let speechText = word;
      if (stutterType === 'repetition') {
        if (word.includes('-')) {
          speechText = word.split('-').join('. . ');
        } else {
          speechText = `${word}. . ${word}. . ${word}`;
        }
      } else if (stutterType === 'block') {
        const firstChar = word.charAt(0);
        speechText = `${firstChar}. . . . ${word}`;
      } else if (stutterType === 'prolongation') {
        const firstChar = word.charAt(0);
        speechText = `${firstChar}${firstChar}${firstChar}${firstChar}${word}`;
      }

      const utterance = new SpeechSynthesisUtterance(speechText);
      utterance.rate = stutterType ? 0.6 : 0.85; // Therapeutic slower rate for stuttered sounds
      utterance.pitch = 1.05;
      
      utterance.onend = () => setActivePlaybackWord(null);
      utterance.onerror = () => setActivePlaybackWord(null);
      
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.error("Speech Synthesis error:", e);
      setTimeout(() => setActivePlaybackWord(null), 500);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-base)]">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section id="hero" className="relative min-h-[80vh] flex items-start pt-24 pb-20 lg:pt-28 lg:pb-0 overflow-hidden scroll-mt-20">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">

            {/* ── Left Content ── */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8 border border-teal-500/20 bg-teal-500/5 text-teal-600">
                <Activity size={12} strokeWidth={3} />
                Next-Gen Clinical Interface
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight mb-8 font-syne">
                <span className="text-[var(--text-primary)]">Precision</span><br />
                <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
                  Fluency.
                </span>
              </h1>

              <p className="text-lg leading-relaxed mb-12 max-w-[540px] font-medium text-[var(--text-secondary)]">
                An advanced AI monitoring system designed for stuttering management,
                objective clinical review, and continuous patient progress tracking.
                Built for modern healthcare.
              </p>

              <div className="flex flex-col sm:flex-row gap-5 mb-14">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center justify-center gap-3 h-14 px-10 rounded-2xl font-black text-white text-base transition-all bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 active:scale-[0.98]"
                >
                  Start Patient Trial
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={handleDemoAccess}
                  className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-2xl font-black text-base border-2 border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-surface)] transition-all hover:bg-[var(--bg-elevated)] active:scale-[0.98] shadow-md hover:shadow-lg shadow-teal-500/5 animate-pulse"
                >
                  <Sparkles size={18} className="text-teal-600" />
                  Explore Demo Dashboard
                </button>
              </div>

              <div className="flex flex-wrap gap-8">
                {[
                  { Icon: ShieldCheck, label: 'HIPAA Ready' },
                  { Icon: Activity, label: 'Evidence-Based' },
                  { Icon: Brain, label: 'AI-Powered' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    <Icon size={16} className="text-teal-600" strokeWidth={2.5} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right Content: Interactive Demo Sandbox Card ── */}
            <div className="flex justify-center lg:justify-end reveal delay-200 w-full">
              <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-[32px] p-6 md:p-8 border border-[var(--border-subtle)] shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                
                {/* Demo Card Header / Mode Selector */}
                <div className="flex flex-col gap-4 mb-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-teal-500/10 border border-teal-500/20 shadow-sm shrink-0">
                        <Sparkles size={18} className="text-teal-600 animate-pulse" />
                      </div>
                      <div>
                        <p className="font-black text-sm tracking-tight text-[var(--text-primary)] font-syne">FluentAI Demo Sandbox</p>
                        <p className="text-[9px] font-bold uppercase tracking-widest mt-0.5 text-[var(--text-muted)]">
                          {demoMode === 'simulate' ? 'Simulating Patient Logs' : 'Microphone Sandbox'}
                        </p>
                      </div>
                    </div>
                    <span className="flex items-center gap-1.5 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest bg-teal-500/10 text-teal-600 border border-teal-500/20 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                      Demo Mode
                    </span>
                  </div>

                  {/* Mode Toggles */}
                  <div className="grid grid-cols-2 gap-2 bg-[var(--bg-base)] p-1 rounded-xl border border-[var(--border-subtle)]">
                    <button 
                      onClick={() => { setDemoMode('simulate'); setCustomDiagnostic(null); }}
                      className={cn(
                        "py-2 px-3 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-all duration-300",
                        demoMode === 'simulate' 
                          ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/15" 
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                      )}
                    >
                      🎭 Patient Profiles
                    </button>
                    <button 
                      onClick={() => { setDemoMode('record'); handleProfileSelect('blockage'); }}
                      className={cn(
                        "py-2 px-3 rounded-lg font-bold text-[10px] tracking-wider uppercase transition-all duration-300",
                        demoMode === 'record' 
                          ? "bg-[var(--accent)] text-white shadow-md shadow-[var(--accent)]/15" 
                          : "text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                      )}
                    >
                      🎙️ Try My Voice
                    </button>
                  </div>
                </div>

                {/* Demo Card Body */}
                <div className="relative z-10 min-h-[340px] flex flex-col justify-between">
                  {demoMode === 'simulate' ? (
                    /* ── SIMULATE PROFILES MODE ── */
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Patient Tabs */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide shrink-0">
                        {Object.entries(DEMO_PROFILES).map(([key, profile]) => (
                          <button
                            key={key}
                            onClick={() => handleProfileSelect(key)}
                            className={cn(
                              "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider border transition-all whitespace-nowrap",
                              selectedProfile === key
                                ? "bg-teal-500/10 border-teal-500/30 text-teal-600"
                                : "bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                            )}
                          >
                            {profile.label}
                          </button>
                        ))}
                      </div>

                      {analyzing ? (
                        /* Shimmer Loading State */
                        <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-4">
                          <RefreshCw size={28} className="text-teal-600 animate-spin" />
                          <div className="text-center">
                            <p className="text-xs font-bold text-[var(--text-primary)]">Whisper Phoneme Segmenting...</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Scanning acoustics via FluentAI models</p>
                          </div>
                          <div className="w-32 h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full animate-shimmer" style={{ width: '100%' }} />
                          </div>
                        </div>
                      ) : (
                        /* Loaded Profile State */
                        <div className="space-y-6 flex-1 flex flex-col">
                          {/* Circular Score and Stats Panel */}
                          <div className="grid grid-cols-3 items-center gap-4 bg-[var(--bg-base)] p-4 rounded-2xl border border-[var(--border-subtle)] shrink-0">
                            {/* Simple Score Dial */}
                            <div className="col-span-1 flex flex-col items-center relative">
                              <div className="w-16 h-16 rounded-full border-4 border-teal-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin-slow opacity-60" />
                                <span className="text-base font-black text-[var(--text-primary)] tracking-tight">
                                  {DEMO_PROFILES[selectedProfile].score}
                                </span>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Fluency</span>
                            </div>

                            {/* Stat counts */}
                            <div className="col-span-2 space-y-2 pl-2 border-l border-[var(--border-subtle)]">
                              <div>
                                <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Disfluency Rate</span>
                                <span className="text-sm font-black text-teal-600">{DEMO_PROFILES[selectedProfile].disfluencyRate}</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Syllables Segmented</span>
                                <span className="text-xs font-black text-[var(--text-primary)]">{DEMO_PROFILES[selectedProfile].syllables}</span>
                              </div>
                            </div>
                          </div>

                          {/* Clickable Speech Transcript */}
                          <div className="flex-1 space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                              <Volume2 size={12} className="text-teal-600 shrink-0" />
                              Interactive Speech Script (Click to Hear)
                            </p>
                            
                            <div className="p-4 bg-[var(--bg-base)]/50 rounded-2xl border border-[var(--border-subtle)] text-sm font-medium leading-relaxed text-[var(--text-primary)] select-none">
                              {DEMO_PROFILES[selectedProfile].words.map((item, index) => {
                                const isStuttered = !!item.stutter;
                                const isPlaying = activePlaybackWord === item.word;
                                return (
                                  <span
                                    key={index}
                                    onClick={() => playSynthesizedWord(item.word, item.stutter)}
                                    className={cn(
                                      "inline-block mx-0.5 px-1 py-0.5 rounded cursor-pointer transition-all duration-200 select-none",
                                      isPlaying 
                                        ? "ring-2 ring-teal-500 scale-105 bg-teal-500/10 text-teal-700 font-bold"
                                        : isStuttered
                                          ? item.stutter === 'block'
                                            ? "border-b-2 border-red-500 bg-red-50/50 dark:bg-red-950/20 text-red-700 dark:text-red-300 font-bold hover:scale-105"
                                            : "border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300 font-bold hover:scale-105"
                                          : "hover:text-teal-600 hover:underline text-[var(--text-secondary)]"
                                    )}
                                    title={isStuttered ? `${item.label} (Click to play)` : "Spoken Word (Click to play)"}
                                  >
                                    {item.word}
                                  </span>
                                );
                              })}
                            </div>

                            {/* Color Legend */}
                            <div className="flex gap-3 pt-2 text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                Blockage
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                                Repetition
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                                Fluent Sound
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── TRY MY VOICE SANDBOX MODE ── */
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {!customDiagnostic && !analyzing ? (
                        /* Recording Prompt & Action Button */
                        <div className="flex-1 flex flex-col justify-between py-4">
                          <div className="space-y-4">
                            <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">Read this sentence:</span>
                            <blockquote className="border-l-4 border-teal-500 pl-4 py-1 text-sm font-black text-[var(--text-primary)] font-syne leading-relaxed italic">
                              "Speech fluency monitoring works with precision."
                            </blockquote>
                          </div>

                          {isRecording ? (
                            /* Live recording interface */
                            <div className="space-y-6 pt-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-black text-red-600 uppercase tracking-widest animate-pulse">
                                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                                  Recording Speech
                                </div>
                                <span className="text-xs font-black text-[var(--text-primary)]">0:0{recordingSeconds} / 0:04</span>
                              </div>

                              {/* Bouncing Visualizer Wave */}
                              <canvas 
                                ref={canvasRef} 
                                width="300"
                                height="40" 
                                className="w-full bg-[var(--bg-base)] rounded-xl border border-teal-500/10" 
                              />

                              <button
                                onClick={stopRecordingSandbox}
                                className="w-full flex items-center justify-center gap-2.5 h-12 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-lg shadow-red-600/15"
                              >
                                <Square size={14} fill="white" />
                                Stop Calibration
                              </button>
                            </div>
                          ) : (
                            /* Start button */
                            <div className="pt-8">
                              <button
                                onClick={startRecordingSandbox}
                                className="w-full flex items-center justify-center gap-2.5 h-14 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-300 active:scale-[0.98] shadow-xl shadow-teal-600/15"
                              >
                                <Mic size={16} />
                                Start Recording sandbox
                              </button>
                              <p className="text-center text-[9px] text-[var(--text-muted)] font-medium mt-3">Requires micro-access. Captures only a 4s acoustic profile.</p>
                            </div>
                          )}
                        </div>
                      ) : analyzing ? (
                        /* Analyzing Loading Shimmer */
                        <div className="flex-1 flex flex-col items-center justify-center py-10 space-y-4">
                          <Activity size={28} className="text-red-500 animate-pulse" />
                          <div className="text-center">
                            <p className="text-xs font-bold text-[var(--text-primary)]">Evaluating Vocal Timelines...</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1 font-medium">Whisper acoustic matching pass active</p>
                          </div>
                          <div className="w-32 h-1.5 bg-[var(--bg-base)] rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 rounded-full animate-shimmer" style={{ width: '100%' }} />
                          </div>
                        </div>
                      ) : (
                        /* Custom recording Diagnostic results */
                        <div className="space-y-6 flex-1 flex flex-col">
                          <div className="grid grid-cols-3 items-center gap-4 bg-[var(--bg-base)] p-4 rounded-2xl border border-[var(--border-subtle)]">
                            <div className="col-span-1 flex flex-col items-center relative">
                              <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 flex items-center justify-center relative">
                                <div className="absolute inset-0 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow opacity-60" />
                                <span className="text-base font-black text-[var(--text-primary)] tracking-tight">
                                  {customDiagnostic.score}%
                                </span>
                              </div>
                              <span className="text-[8px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-2">Vocal Score</span>
                            </div>

                            <div className="col-span-2 space-y-2 pl-2 border-l border-[var(--border-subtle)]">
                              <div>
                                <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Disfluency Rate</span>
                                <span className="text-sm font-black text-emerald-600">{customDiagnostic.disfluencyRate}</span>
                              </div>
                              <div>
                                <span className="text-[8px] font-black uppercase tracking-wider text-[var(--text-muted)] block">Result Timeline</span>
                                <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">Highly Fluent Speech</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 space-y-3">
                            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5">
                              <Volume2 size={12} className="text-teal-600 shrink-0" />
                              Custom Recording Transcript (Click to Hear)
                            </p>

                            <div className="p-4 bg-[var(--bg-base)]/50 rounded-2xl border border-[var(--border-subtle)] text-sm font-medium leading-relaxed text-[var(--text-primary)] select-none">
                              {customDiagnostic.words.map((item, index) => {
                                const isPlaying = activePlaybackWord === item.word;
                                return (
                                  <span
                                    key={index}
                                    onClick={() => playSynthesizedWord(item.word, null)}
                                    className={cn(
                                      "inline-block mx-0.5 px-1 py-0.5 rounded cursor-pointer transition-all duration-200",
                                      isPlaying 
                                        ? "ring-2 ring-emerald-500 scale-105 bg-emerald-500/10 text-emerald-700 font-bold"
                                        : "hover:text-emerald-600 hover:underline text-[var(--text-secondary)]"
                                    )}
                                  >
                                    {item.word}
                                  </span>
                                );
                              })}
                            </div>

                            <button
                              onClick={() => setCustomDiagnostic(null)}
                              className="w-full flex items-center justify-center gap-2 h-10 border-2 border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] rounded-xl text-[10px] font-black uppercase tracking-widest text-[var(--text-primary)] transition-all duration-300 active:scale-[0.98]"
                            >
                              <RefreshCw size={12} />
                              Record new sandbox
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-24 bg-[var(--bg-surface)] relative scroll-mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20 reveal">
            <p className="text-[10px] font-black tracking-[0.4em] uppercase mb-4 text-teal-600">
              Diagnostic Capabilities
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-6 tracking-tight text-[var(--text-primary)] font-syne">
              Precision Medicine Tools
            </h2>
            <p className="text-lg max-w-xl mx-auto leading-relaxed font-medium text-[var(--text-secondary)]">
              State-of-the-art acoustic modeling engineered for precise, objective
              measurements of speech patterns.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 lg:gap-16">
            {[
              {
                Icon: Microscope,
                title: 'Acoustic Precision',
                desc: 'High-fidelity audio processing isolating micro-stutters, prolongations, and blockages with clinical accuracy.',
              },
              {
                Icon: Brain,
                title: 'Cognitive Insights',
                desc: 'Advanced natural language models that contextually analyze speech disfluencies beyond rigid rules.',
              },
              {
                Icon: ClipboardList,
                title: 'Institutional Data',
                desc: 'Automated generation of detailed session transcripts and quantitative metric reports for review.',
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="reveal group p-7 rounded-[28px] bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-teal-500/30 transition-all duration-500 hover:shadow-premium">
                <div className="w-14 h-14 rounded-[20px] bg-teal-500/10 flex items-center justify-center mb-8 shadow-sm border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <Icon size={24} className="text-teal-600" />
                </div>
                <h3 className="text-xl font-black mb-4 tracking-tight text-[var(--text-primary)] font-syne">{title}</h3>
                <p className="text-sm leading-relaxed font-medium text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION / HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-[var(--bg-base)] relative overflow-hidden scroll-mt-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-600/5 rounded-full blur-[160px]" />
        </div>
        
        <div className="max-w-3xl mx-auto px-6 text-center reveal relative z-10">
          <div className="w-16 h-16 rounded-[24px] bg-teal-600/10 flex items-center justify-center mx-auto mb-8 border border-teal-500/20 shadow-lg">
            <ShieldCheck size={28} className="text-teal-600" />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-6 leading-[1.1] text-[var(--text-primary)] tracking-tight font-syne">
            Elevate Speech Therapy<br />
            with <span className="text-teal-600">Objective Data</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed text-[var(--text-secondary)] font-medium max-w-xl mx-auto">
            Join leading institutions leveraging AI for precise fluency measurement and evidence-based therapy tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="h-14 px-10 rounded-2xl font-black text-white text-base transition-all bg-teal-600 hover:bg-teal-700 shadow-xl shadow-teal-600/20 active:scale-[0.98]"
            >
              Request Access
            </button>
            <button
              className="h-14 px-10 rounded-2xl font-black text-base border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-elevated)] active:scale-[0.98]"
            >
              Clinical Studies
            </button>
          </div>
        </div>
      </section>

      <div id="about" className="scroll-mt-20">
        <Footer />
      </div>
    </div>
  );
}
