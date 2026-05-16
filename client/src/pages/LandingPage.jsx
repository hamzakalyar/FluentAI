import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users, BarChart3, Zap
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

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

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--bg-base)]">
      <Navbar />

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-0 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/5 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">

            {/* ── Left Content ── */}
            <div className="reveal">
              <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] px-4 py-2 rounded-full mb-8 border border-teal-500/20 bg-teal-500/5 text-teal-600">
                <Activity size={12} strokeWidth={3} />
                Next-Gen Clinical Interface
              </div>

              <h1 className="text-5xl lg:text-6xl xl:text-8xl font-black leading-[1.02] tracking-tight mb-8 font-syne">
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
                  className="inline-flex items-center justify-center gap-3 h-14 px-10 rounded-2xl font-black text-base border-2 border-[var(--border-subtle)] text-[var(--text-primary)] bg-[var(--bg-surface)] transition-all hover:bg-[var(--bg-elevated)] active:scale-[0.98]"
                >
                  <Users size={18} />
                  For Clinicians
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

            {/* ── Right Content: Live Dashboard Mockup ── */}
            <div className="flex justify-center lg:justify-end reveal delay-200">
              <div className="w-full max-w-md bg-[var(--bg-surface)] rounded-[40px] p-10 border border-[var(--border-subtle)] shadow-premium relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500/5 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-125 transition-transform duration-1000" />
                
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-teal-500/10 border border-teal-500/20 shadow-sm">
                      <Activity size={22} className="text-teal-600" />
                    </div>
                    <div>
                      <p className="font-black text-base tracking-tight text-[var(--text-primary)] font-syne">Fluency Profile</p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-1 text-[var(--text-muted)]">Subject #8492-A</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-2 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                </div>

                <div className="space-y-8 relative z-10">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Syllables Spoken</span>
                      <span className="text-sm font-black text-[var(--text-primary)]">1,248</span>
                    </div>
                    <div className="h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-600 to-teal-400" style={{ width: '82%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-[var(--text-muted)]">Disfluency Rate</span>
                      <span className="text-sm font-black text-teal-600">4.2%</span>
                    </div>
                    <div className="h-2.5 bg-[var(--bg-base)] rounded-full overflow-hidden shadow-inner">
                      <div className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-300" style={{ width: '18%' }} />
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[var(--border-subtle)]">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] mb-6 text-[var(--text-muted)]">Recent Performance</p>
                    <div className="space-y-4">
                      {[
                        { date: 'May 12, 2025', score: '94/100', delta: '+3' },
                        { date: 'May 10, 2025', score: '91/100', delta: '+6' },
                      ].map(({ date, score, delta }) => (
                        <div key={date} className="flex items-center justify-between p-4 bg-[var(--bg-base)] rounded-2xl border border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)] transition-colors">
                          <span className="text-xs font-bold text-[var(--text-secondary)]">{date}</span>
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-black text-[var(--text-primary)]">{score}</span>
                            <span className="text-[10px] font-black px-2 py-1 rounded-lg bg-emerald-500/10 text-emerald-600">{delta}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES SECTION ── */}
      <section id="features" className="py-32 bg-[var(--bg-surface)] relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24 reveal">
            <p className="text-[11px] font-black tracking-[0.4em] uppercase mb-5 text-teal-600">
              Diagnostic Capabilities
            </p>
            <h2 className="text-5xl lg:text-6xl font-black mb-8 tracking-tight text-[var(--text-primary)] font-syne">
              Precision Medicine Tools
            </h2>
            <p className="text-xl max-w-2xl mx-auto leading-relaxed font-medium text-[var(--text-secondary)]">
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
              <div key={title} className="reveal group p-8 rounded-[32px] bg-[var(--bg-base)] border border-[var(--border-subtle)] hover:border-teal-500/30 transition-all duration-500 hover:shadow-premium">
                <div className="w-16 h-16 rounded-[22px] bg-teal-500/10 flex items-center justify-center mb-10 shadow-sm border border-teal-500/20 group-hover:scale-110 transition-transform">
                  <Icon size={28} className="text-teal-600" />
                </div>
                <h3 className="text-2xl font-black mb-5 tracking-tight text-[var(--text-primary)] font-syne">{title}</h3>
                <p className="text-base leading-relaxed font-medium text-[var(--text-secondary)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ── */}
      <section className="py-40 bg-[var(--bg-base)] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-600/5 rounded-full blur-[160px]" />
        </div>
        
        <div className="max-w-4xl mx-auto px-6 text-center reveal relative z-10">
          <div className="w-20 h-20 rounded-[32px] bg-teal-600/10 flex items-center justify-center mx-auto mb-12 border border-teal-500/20 shadow-lg">
            <ShieldCheck size={36} className="text-teal-600" />
          </div>
          <h2 className="text-5xl lg:text-7xl font-black mb-10 leading-[1.1] text-[var(--text-primary)] tracking-tighter font-syne">
            Elevate Speech Therapy<br />
            with <span className="text-teal-600">Objective Data</span>
          </h2>
          <p className="text-xl mb-16 leading-relaxed text-[var(--text-secondary)] font-medium max-w-2xl mx-auto">
            Join leading institutions leveraging AI for precise fluency measurement and evidence-based therapy tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="h-16 px-12 rounded-2xl font-black text-white text-lg transition-all bg-teal-600 hover:bg-teal-700 shadow-2xl shadow-teal-600/30 active:scale-[0.98]"
            >
              Request Access
            </button>
            <button
              className="h-16 px-12 rounded-2xl font-black text-lg border-2 border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] transition-all hover:bg-[var(--bg-elevated)] active:scale-[0.98]"
            >
              Clinical Studies
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
