import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users, Sparkles, Volume2, Mic, Play, Pause, AlertCircle, ArrowUpRight, CheckCircle2, ChevronRight, Zap, Target
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export default function Features() {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();
  const [activeTab, setActiveTab] = useState('studio');

  const FEATURE_TABS = [
    {
      id: 'studio',
      title: 'Practice Studio',
      subtitle: 'Clinical intake & visualizers',
      icon: <Mic size={18} />,
      badge: 'Interactive',
      desc: 'Our real-time speech studio is equipped with dual visualizers, secure audio segment buffers, and targeted clinical scripts designed to isolate core acoustic behaviors.',
      bullets: [
        'Secure 44.1kHz WAV intake blocks',
        'Interactive decibel envelope visualizer',
        'Segmented target-sound guidelines',
        'Automatic noise cancellation gates'
      ],
      color: 'teal'
    },
    {
      id: 'analysis',
      title: 'AI Classification',
      subtitle: 'Neural disfluency pipelines',
      icon: <Brain size={18} />,
      badge: 'ML Engine',
      desc: 'Our dual convolutional and recurrent neural networks identify the exact locations, types, and lengths of stutter disfluencies with human-therapist levels of precision.',
      bullets: [
        'Whisper phoneme time-alignment',
        'Blockage, Repetition, and Prolongation classifiers',
        'Objective fluency percentage indexes',
        'Clinically validated cohort benchmarks'
      ],
      color: 'indigo'
    },
    {
      id: 'reports',
      title: 'Interactive Reports',
      subtitle: 'Word-isolated audios',
      icon: <Activity size={18} />,
      badge: 'Analytics',
      desc: 'Transform raw vocal recordings into an interactive transcription grid, allowing clinicians to click any token to isolate and hear patient acoustics.',
      bullets: [
        'Interactive word-by-word transcription grids',
        'Vocal timeline alignment players',
        'Fluency trend analytics and logs',
        'Secure shareable PDF exports'
      ],
      color: 'emerald'
    },
    {
      id: 'practice',
      title: 'Practice Engine',
      subtitle: 'Therapeutic workout drills',
      icon: <Target size={18} />,
      badge: 'Guided',
      desc: 'Provide patients with custom speech exercises generated dynamically based on weak sounds detected during assessment sessions.',
      bullets: [
        'Dynamic sound-mastery tracking logs',
        'Contextual articulation exercises',
        'Interactive daily completion drills',
        'Friendly progress goal animations'
      ],
      color: 'purple'
    }
  ];

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const activeFeature = FEATURE_TABS.find(t => t.id === activeTab);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden relative">
      <Navbar />

      {/* Decorative Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
      <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />

      {/* ── HERO BANNER ── */}
      <section className="pt-28 pb-16 lg:pt-32 relative">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8 border border-teal-500/20 bg-teal-500/5 text-teal-600 animate-fade-in">
            <Sparkles size={12} className="animate-pulse" />
            Product Tour
          </div>

          <h1 className="text-4xl lg:text-6xl font-black mb-6 tracking-tight font-syne leading-none">
            Deep-Tech Clinical <br />
            <span className="bg-gradient-to-r from-teal-600 to-teal-400 bg-clip-text text-transparent">
              Speech Diagnostics.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium max-w-[580px] mx-auto leading-relaxed">
            FluentAI bridges the gap between neural audio analysis and interactive, clinical workflows. Explore our core features below.
          </p>
        </div>
      </section>

      {/* ── CORE CAPABILITIES INTERACTIVE GRID ── */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Tab Selectors */}
          <div className="lg:col-span-1 space-y-3 bg-[var(--bg-surface)] p-4 rounded-3xl border border-[var(--border-subtle)] shadow-sm">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] pl-2 block mb-2">SYSTEM UTILITIES</span>
            {FEATURE_TABS.map(tab => {
              const isSelected = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "w-full text-left p-4 rounded-2xl border transition-all duration-300 flex items-start gap-4",
                    isSelected
                      ? "bg-teal-500/10 border-teal-500/30 text-teal-600 shadow-md shadow-teal-500/5"
                      : "bg-transparent border-transparent text-[var(--text-secondary)] hover:bg-[var(--bg-elevated)]"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center border shrink-0",
                    isSelected
                      ? "bg-teal-500/20 border-teal-500/30 text-teal-600"
                      : "bg-[var(--bg-base)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                  )}>
                    {tab.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-xs uppercase tracking-wider">{tab.title}</span>
                      {isSelected && (
                        <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-teal-500 text-white font-bold">
                          {tab.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-[var(--text-muted)] mt-1 font-semibold">{tab.subtitle}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: High Fidelity Preview */}
          <div className="lg:col-span-2 bg-[var(--bg-surface)] p-8 rounded-3xl border border-[var(--border-subtle)] shadow-md min-h-[420px] flex flex-col justify-between transition-all duration-500 animate-fade-in relative overflow-hidden">
            {/* Background color glow matching active feature */}
            <div className={cn(
              "absolute -top-12 -right-12 w-48 h-48 rounded-full blur-[80px] opacity-20 -z-10",
              activeTab === 'studio' ? 'bg-teal-500' :
              activeTab === 'analysis' ? 'bg-indigo-500' :
              activeTab === 'reports' ? 'bg-emerald-500' : 'bg-purple-500'
            )} />

            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-600 text-[10px] font-black uppercase tracking-widest">
                {activeFeature.icon}
                {activeFeature.title} Mode
              </div>

              <h3 className="text-2xl font-black tracking-tight text-[var(--text-primary)] font-syne mt-2">
                {activeFeature.subtitle}
              </h3>

              <p className="text-sm leading-relaxed text-[var(--text-secondary)] font-medium">
                {activeFeature.desc}
              </p>

              <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-[var(--border-subtle)]">
                {activeFeature.bullets.map((bullet, idx) => (
                  <div key={idx} className="flex gap-3 items-center">
                    <CheckCircle2 size={16} className="text-teal-600 shrink-0" />
                    <span className="text-xs font-bold text-[var(--text-secondary)]">{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-8 flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleDemoAccess}
                className="px-6 py-3 bg-[var(--accent-navy)] text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-teal-700 transition-all flex items-center justify-center gap-2"
              >
                Launch Practice Studio <ArrowRight size={14} />
              </button>
              <button
                onClick={() => navigate('/how-it-works')}
                className="px-6 py-3 border-2 border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2"
              >
                Learn How It Works <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ── SECURITY & CLINICAL INTEGRITY BANNER ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-xl border border-white/5">
          <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/10 rounded-full blur-[80px] -z-10" />
          
          <div className="max-w-2xl space-y-6">
            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-teal-400">CLINICAL SECURITY & PIPELINE TRUST</span>
            <h2 className="text-3xl md:text-4xl font-black font-syne tracking-tight leading-tight">
              HIPAA-Ready Speech Infrastructure
            </h2>
            <p className="text-xs md:text-sm text-slate-300 leading-relaxed font-medium">
              We process acoustic samples with bank-grade encryption at rest and in transit. FluentAI is architected to prioritize clinic safety and patient data privacy above all else.
            </p>
            <div className="flex flex-wrap gap-6 pt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-400" />
                End-to-End Encryption
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-400" />
                HIPAA Compliant Datastores
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={16} className="text-teal-400" />
                Zero External Model Training
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 bg-slate-950 text-white text-center relative overflow-hidden border-t border-white/5 mb-24 rounded-3xl max-w-6xl mx-auto px-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-teal-950/20 to-transparent -z-10" />
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-syne tracking-tight">Ready to Practice Fluent Speech?</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto font-medium">
            Join clinics globally using FluentAI to track disfluency, run interactive drills, and build vocal confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button onClick={handleDemoAccess} className="h-12 px-8 bg-teal-500 text-slate-950 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-teal-500/20">
              Try Instant Demo <Sparkles size={14} />
            </button>
            <button onClick={() => navigate('/login')} className="h-12 px-8 border border-white/20 hover:bg-white/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              Sign In Account
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
