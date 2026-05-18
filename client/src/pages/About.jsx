import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users, Sparkles, Volume2, Mic, Play, Pause, AlertCircle, ArrowUpRight, GraduationCap, Code2, HeartHandshake
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { useAuth } from '../context/AuthContext';
import { cn } from '../utils/cn';

export default function About() {
  const navigate = useNavigate();
  const { loginDemo } = useAuth();

  const handleDemoAccess = () => {
    loginDemo();
    navigate('/dashboard');
  };

  const VALUES = [
    {
      icon: <GraduationCap className="text-teal-600 animate-pulse" size={24} />,
      title: "Research-First Grounding",
      desc: "Our machine learning pipelines are fully aligned with gold-standard speech-pathology frameworks like the Stuttering Severity Instrument (SSI-4), ensuring reliable clinical mapping."
    },
    {
      icon: <Brain className="text-indigo-600" size={24} />,
      title: "Intelligent Augmentation",
      desc: "We don't replace therapists; we empower them. Automated syllable segmentations reduce active evaluation time by 80%, giving practitioners more hours for direct therapy."
    },
    {
      icon: <HeartHandshake className="text-rose-600" size={24} />,
      title: "Patient Empathy at the Center",
      desc: "Speech management is a sensitive journey. Our patient-facing practice dashboard is crafted to feel encouraging, safe, and entirely free of pressure."
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden relative">
      <Navbar />

      {/* Background glowing rings */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[130px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-[110px] -z-10" />

      {/* ── HERO BANNER ── */}
      <section className="pt-28 pb-16 lg:pt-32 relative">
        <div className="max-w-6xl mx-auto px-6 text-center space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-2 border border-indigo-500/20 bg-indigo-500/5 text-indigo-600">
            <Users size={12} />
            Our Mission & Philosophy
          </div>

          <h1 className="text-4xl lg:text-6xl font-black tracking-tight font-syne leading-none">
            Bridging Audio Tech & <br />
            <span className="bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent">
              Clinical Speech Pathology.
            </span>
          </h1>

          <p className="text-sm md:text-base text-[var(--text-secondary)] font-medium max-w-[620px] mx-auto leading-relaxed">
            FluentAI was born from a simple thesis: that advanced audio classification and phonetic alignment networks can make objective disfluency monitoring instant, simple, and accessible for clinics worldwide.
          </p>
        </div>
      </section>

      {/* ── CORE SCIENTIFIC VALUE PROPOSITIONS ── */}
      <section className="py-12 max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          {VALUES.map((val, idx) => (
            <div key={idx} className="bg-[var(--bg-surface)] p-6 rounded-3xl border border-[var(--border-subtle)] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between min-h-[220px]">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-base)] border border-[var(--border-subtle)] flex items-center justify-center mb-6 shadow-inner shrink-0">
                {val.icon}
              </div>
              <div className="space-y-2 flex-1">
                <h3 className="font-black text-sm uppercase tracking-wider text-[var(--text-primary)]">{val.title}</h3>
                <p className="text-xs leading-relaxed text-[var(--text-secondary)] font-medium">{val.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── THE SCIENTIFIC CHALLENGE ── */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center bg-[var(--bg-surface)] p-8 md:p-12 rounded-3xl border border-[var(--border-subtle)] shadow-md">
          <div className="space-y-6">
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-teal-600 block">THE TRADITIONAL DIAGNOSTIC BOTTLENECK</span>
            <h2 className="text-2xl md:text-3xl font-black font-syne tracking-tight leading-tight">
              Why Automated Phonetic Alignment Matters
            </h2>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              Traditionally, stutter assessments require speech therapists to manually review recordings with a stopwatch and paper sheet, counting every individual block, repeat, and prolongation. 
            </p>
            <p className="text-xs md:text-sm text-[var(--text-secondary)] leading-relaxed font-medium">
              This manual intake is highly time-intensive, subjective, and difficult to compare across sessions. FluentAI leverages Whisper to align syllables with microsecond accuracy, extracting acoustic features automatically so therapists receive high-fidelity, objective data at the speed of speech.
            </p>
          </div>
          
          <div className="space-y-4 bg-[var(--bg-base)] p-6 rounded-2xl border border-[var(--border-subtle)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] block">SYSTEM ACCURACY QUOTAS</span>
            <div className="space-y-3">
              {[
                { label: "Temporal Phoneme Alignment", pct: "98.4%" },
                { label: "Clinical Cohort Diagnostic Match", pct: "94.2%" },
                { label: "Time Saved on Manual Syllable Counting", pct: "80%" }
              ].map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-[var(--border-subtle)] last:border-0">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">{item.label}</span>
                  <span className="text-sm font-black text-indigo-600">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION SECTION ── */}
      <section className="py-20 bg-slate-950 text-white text-center relative overflow-hidden border-t border-white/5 mb-24 rounded-3xl max-w-6xl mx-auto px-6 shadow-2xl">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/20 to-transparent -z-10" />
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl md:text-5xl font-black font-syne tracking-tight">Experience Deep Fluency Science</h2>
          <p className="text-xs md:text-sm text-slate-400 max-w-lg mx-auto font-medium">
            Join the digital speech therapy workflow, run interactive clinical evaluations, and review objective metrics instantly.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <button onClick={handleDemoAccess} className="h-12 px-8 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20">
              Try Instant Demo <Sparkles size={14} />
            </button>
            <button onClick={() => navigate('/how-it-works')} className="h-12 px-8 border border-white/20 hover:bg-white/10 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
              How It Works
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
