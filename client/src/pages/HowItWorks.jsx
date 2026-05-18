import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users, Sparkles, Volume2, Mic, Play, Pause, AlertCircle, ArrowUpRight
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export default function HowItWorks() {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  const PIPELINE_STEPS = [
    {
      num: "01",
      title: "Vocal Intake & Calibration",
      desc: "Local Web Audio API captures secure WAV chunks, validating clean sample sizes and applying real-time gain normalizations to stabilize high-frequency background spikes.",
      badge: "Intake",
      color: "from-teal-600/20 to-teal-400/5",
      metrics: ["44.1kHz WAV Intake", "Gain Normalization", "Intelligent Noise Gates"]
    },
    {
      num: "02",
      title: "Acoustic Feature Extraction",
      desc: "Extracts primary speech variables including energy envelopes, f0 pitch contours, and silence segments. Calculates base Syllable-per-Minute tempos dynamically.",
      badge: "DSP",
      color: "from-emerald-600/20 to-emerald-400/5",
      metrics: ["Mel-Frequency Cepstral Coefficients", "f0 Pitch Trackers", "Energy Envelope Grids"]
    },
    {
      num: "03",
      title: "Whisper Phoneme Alignment",
      desc: "Feeds normalized spectrogram frames into a custom Whisper AI engine. Maps spoken words to exact target script timelines, yielding start and end boundaries (ms).",
      badge: "Whisper AI",
      color: "from-indigo-600/20 to-indigo-400/5",
      metrics: ["Word-Boundary Time-Stamps", "Spectral Spectrogram Pass", "Phoneme Anchor Logs"]
    },
    {
      num: "04",
      title: "Neural Stutter Classification",
      desc: "Evaluates segmented syllables against a trained disfluency classifier. Identifies blocks, prolongations, and repetitions, outputting objective accuracy probabilities.",
      badge: "ML Engine",
      color: "from-purple-600/20 to-purple-400/5",
      metrics: ["Blockage Identification", "Abnormal Pause Diagnostics", "Prolongation Detectors"]
    },
    {
      num: "05",
      title: "Interactive Clinical Report",
      desc: "Compiles all diagnostic telemetry into a gorgeous clinical details dashboard. Saves secure stats and allows therapists to review speech blocks with word-level clicks.",
      badge: "Analytics",
      color: "from-rose-600/20 to-rose-400/5",
      metrics: ["Unified Fluency Index", "Therapist Action Timeline", "Interactive Transcription Player"]
    }
  ];

  const MODELS_INFO = [
    {
      icon: <Brain className="text-teal-600" size={28} />,
      title: "Phoneme Alignment Net (Whisper-Based)",
      desc: "Engineered on top of OpenAI's state-of-the-art Whisper engine, this model identifies *what* was spoken and maps the exact millisecond offsets of each word. This enables our isolated acoustic playback utility.",
      accuracy: "98.4% Temporal Precision",
      tag: "Whisper-v3-Turbo"
    },
    {
      icon: <Microscope className="text-indigo-600" size={28} />,
      title: "Acoustic Feature Classifier (CNN/LSTM)",
      desc: "Our secondary model evaluates raw audio frequency grids, pitch variations, and sudden decibel drops. By analyzing speech patterns against our clinical dataset, it categorizes disfluencies with human-therapist levels of precision.",
      accuracy: "94.2% Diagnostic Match Rate",
      tag: "Custom PyTorch Classifier"
    }
  ];

  const FAQS = [
    {
      q: "How does the AI distinguish between an normal pause and a speech block?",
      a: "Speech blocks exhibit distinct spectral footprints, including high-frequency muscular struggle signals followed by sudden acoustic silence. Our classifier evaluates energy levels alongside time-aligned text transcript anchors to identify true disfluency blocks vs. structural pauses."
    },
    {
      q: "Is the platform HIPAA compliant?",
      a: "Yes. All speech transcripts, audio WAV waveforms, and therapist evaluations are fully encrypted at rest and in transit. No personal clinical profiles are ever utilized for global model calibration without active therapist permission."
    },
    {
      q: "What variables affect the Syllables-Per-Minute metric?",
      a: "Vocal frequency rates, baseline syllable weights (derived from script target text), and silence durations. Users can fine-tune target tempo parameters in settings to match custom cohort averages."
    }
  ];

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden relative">
      <Navbar />

      {/* Decorative gradients */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[140px] -z-10" />
      <div className="absolute top-80 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[120px] -z-10" />

      {/* ── HERO BANNER ── */}
      <section className="pt-32 pb-16 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-6 border border-teal-500/20 bg-teal-500/5 text-teal-600">
          <Microscope size={12} strokeWidth={3} />
          Technical & Clinical Architecture
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black font-syne tracking-tight leading-none mb-6">
          How <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">FluentAI</span> Works
        </h1>
        <p className="text-base sm:text-lg text-[var(--text-secondary)] font-medium max-w-2xl mx-auto leading-relaxed">
          Explore the advanced neural alignment and stutter classification engines powering the platform. Below is our clinical speech-processing pipeline.
        </p>
      </section>

      {/* ── INTERACTIVE PIPELINE PROGRESSION ── */}
      <section className="max-w-6xl mx-auto px-6 mb-24">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[36px] p-8 md:p-12 shadow-premium relative">
          <h2 className="font-syne text-2xl font-black text-[var(--text-primary)] mb-10 text-center sm:text-left">
            Interactive Speech Processing Pipeline
          </h2>

          {/* Glowing steps flow connector */}
          <div className="grid grid-cols-5 gap-4 mb-10 relative">
            {PIPELINE_STEPS.map((step, idx) => {
              const isActive = idx === activeStep;
              const isPassed = idx < activeStep;
              return (
                <div key={idx} className="relative flex flex-col items-center">
                  <button
                    onClick={() => setActiveStep(idx)}
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 relative z-10 border shadow-md",
                      isActive 
                        ? "bg-teal-600 text-white border-teal-500 ring-4 ring-teal-500/10 scale-110"
                        : isPassed
                          ? "bg-teal-50 text-teal-600 border-teal-200"
                          : "bg-[var(--bg-base)] text-[var(--text-muted)] border-[var(--border-subtle)] hover:border-slate-300"
                    )}
                  >
                    {step.num}
                  </button>
                  <span className="hidden sm:block text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] mt-3 text-center">
                    {step.badge}
                  </span>
                  
                  {/* Connectors */}
                  {idx < 4 && (
                    <div className="absolute top-6 left-[calc(50%+24px)] right-[calc(-50%+24px)] h-0.5 bg-slate-100 -z-0">
                      <div 
                        className={cn(
                          "h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500",
                          isPassed ? "w-full" : "w-0"
                        )} 
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stepper Details Card */}
          <div className="grid md:grid-cols-2 gap-8 items-center bg-[var(--bg-base)]/50 rounded-[28px] p-6 sm:p-8 border border-[var(--border-subtle)] relative overflow-hidden transition-all duration-500">
            <div className="space-y-4">
              <span className="inline-block px-3 py-1 bg-teal-600/10 text-teal-600 font-black text-[9px] uppercase tracking-wider rounded-lg">
                Pipeline Stage {PIPELINE_STEPS[activeStep].num}
              </span>
              <h3 className="font-syne text-2xl font-black text-[var(--text-primary)]">
                {PIPELINE_STEPS[activeStep].title}
              </h3>
              <p className="text-sm text-[var(--text-secondary)] font-medium leading-relaxed">
                {PIPELINE_STEPS[activeStep].desc}
              </p>
            </div>
            
            <div className="bg-[var(--bg-surface)] p-6 rounded-2xl border border-[var(--border-subtle)] shadow-sm space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-teal-600" />
                Active Model Telemetry
              </p>
              {PIPELINE_STEPS[activeStep].metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)] py-1.5 border-b border-[var(--border-subtle)]/50 last:border-b-0">
                  <span>{metric}</span>
                  <span className="text-[10px] font-mono text-teal-600 font-bold uppercase">Ready</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── MODELS DETAILS GRID ── */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <h2 className="font-syne text-3xl font-black tracking-tight mb-3">Our Core Neural Classifiers</h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium max-w-lg mx-auto">
            Deep neural networks calibrated specifically for target phoneme evaluation and stuttering diagnostic benchmarks.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {MODELS_INFO.map((model, idx) => (
            <div key={idx} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[32px] p-8 shadow-premium flex flex-col justify-between hover:scale-[1.01] transition-transform relative group overflow-hidden">
              {/* Backlight glow */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div>
                <div className="w-14 h-14 rounded-2xl bg-teal-500/5 border border-teal-500/10 flex items-center justify-center mb-6">
                  {model.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-teal-600 bg-teal-600/10 px-2.5 py-1 rounded-md">
                  {model.tag}
                </span>
                <h3 className="font-syne text-lg font-black text-[var(--text-primary)] mt-4 mb-3">
                  {model.title}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] font-medium leading-relaxed mb-6">
                  {model.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Verified Rate</span>
                <span className="text-xs font-black text-emerald-600">{model.accuracy}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PIPELINE GRAPHICS / TIMELINE PROGRESSION ── */}
      <section className="max-w-5xl mx-auto px-6 mb-24">
        <div className="bg-slate-900 text-white rounded-[36px] p-8 md:p-12 shadow-premium relative overflow-hidden">
          {/* Neon grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/10 border border-teal-500/20 text-teal-400 font-black text-[9px] uppercase tracking-wider rounded-lg mb-6">
                <Activity size={10} /> Real-Time Signal Stream
              </span>
              <h2 className="font-syne text-3xl font-black tracking-tight leading-none mb-6">
                Millisecond Time-Alignments
              </h2>
              <p className="text-slate-400 text-sm font-medium leading-relaxed mb-8">
                Speech therapy depends on knowing *precisely* when stutters occur. By time-aligning target word structures with raw audio decibel waveforms, therapists isolate block durations down to ~20ms, allowing targeted phonetic drills.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                  98% Script Sync Rate
                </div>
              </div>
            </div>

            {/* Neural Matrix graphic */}
            <div className="bg-slate-950/80 rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Audio Spectrum</span>
                <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase animate-pulse">Streaming</span>
              </div>
              <div className="h-28 flex items-end gap-1.5 px-2">
                {[40, 75, 20, 95, 60, 110, 30, 85, 55, 90, 45, 120, 25, 70, 50, 100, 65, 80, 35, 95, 45].map((val, idx) => (
                  <div 
                    key={idx} 
                    className="flex-1 bg-teal-500 rounded-sm hover:bg-emerald-400 transition-colors"
                    style={{ 
                      height: `${val}%`,
                      opacity: idx % 2 === 0 ? 0.9 : 0.6,
                      animation: `bounce 1s ease-in-out infinite alternate ${idx * 0.05}s`
                    }} 
                  />
                ))}
              </div>
              <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-slate-800">
                <span>0.00s</span>
                <span>Anchor: [Practice]</span>
                <span>4.00s</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDIONS ── */}
      <section className="max-w-3xl mx-auto px-6 mb-24">
        <h2 className="font-syne text-3xl font-black text-center mb-10">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-6 text-left font-bold text-sm text-[var(--text-primary)] hover:text-teal-600 transition-colors focus:outline-none"
                >
                  <span>{faq.q}</span>
                  <span className={cn("text-xl transition-transform duration-300", isOpen ? "rotate-45" : "")}>+</span>
                </button>
                <div 
                  className={cn(
                    "transition-all duration-300 ease-in-out overflow-hidden px-6 text-xs text-[var(--text-secondary)] font-medium leading-relaxed",
                    isOpen ? "pb-6 max-h-48 border-t border-[var(--border-subtle)]/50 pt-4" : "max-h-0"
                  )}
                >
                  {faq.a}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="max-w-4xl mx-auto px-6 text-center mb-24">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-[40px] p-8 md:p-14 shadow-premium relative overflow-hidden border border-slate-800">
          <div className="absolute inset-0 bg-teal-500/5 blur-[80px] -z-10" />
          <h2 className="font-syne text-3xl sm:text-4xl font-black mb-4 leading-tight">
            Ready to Explore the Platform?
          </h2>
          <p className="text-slate-400 text-sm font-medium max-w-md mx-auto mb-8 leading-relaxed">
            Skip registration entirely and explore our clinical workspace instantly in full interactive Guest Demo Mode!
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={handleDemoAccess}
              className="group inline-flex items-center justify-center gap-3.5 h-13 px-8 bg-teal-600 hover:bg-teal-700 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-teal-600/10 active:scale-95"
            >
              Explore Guest Dashboard
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center justify-center gap-3.5 h-13 px-8 border border-slate-800 hover:bg-slate-900 text-slate-300 text-xs font-black uppercase tracking-wider rounded-xl transition-all"
            >
              Sign In Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
