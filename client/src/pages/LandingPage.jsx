import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity, ShieldCheck, Microscope, Brain, ClipboardList,
  ArrowRight, Users
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

/* ── Design tokens ─────────────────────── */
const T = {
  teal:    '#0D9488',
  tealMid: '#0891B2',
  navy:    '#0F172A',
  text:    '#374151',
  muted:   '#6B7280',
  border:  '#E5E7EB',
  light:   '#F8FAFC',
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

/* ═══════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  useReveal();

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="hero-gradient min-h-[90vh] flex items-center py-20 lg:py-0">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left ── */}
            <div>
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border"
                style={{ background: 'rgba(13,148,136,0.08)', borderColor: 'rgba(13,148,136,0.2)', color: T.teal }}
              >
                <Activity size={12} strokeWidth={2.5} />
                Next-Generation Clinical Interface
              </div>

              {/* Headline */}
              <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black leading-[1.06] tracking-tight mb-6">
                <span style={{ color: T.navy }}>Precision Fluency</span><br />
                <span style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Analytics.
                </span>
              </h1>

              <p className="text-lg leading-relaxed mb-10 max-w-[480px]" style={{ color: T.text }}>
                An advanced AI monitoring system designed for stuttering management,
                objective clinical review, and continuous patient progress tracking.
                Built for modern healthcare.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 mb-10">
                <button
                  onClick={() => navigate('/register')}
                  className="group inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-bold text-white text-sm transition-all hover:shadow-lg active:scale-[0.98]"
                  style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)', boxShadow: '0 4px 16px rgba(13,148,136,0.35)' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 24px rgba(13,148,136,0.45)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 16px rgba(13,148,136,0.35)'}
                >
                  Start Patient Trial
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
                <button
                  className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-full font-semibold text-sm border-2 transition-all hover:bg-white/60 active:scale-[0.98]"
                  style={{ borderColor: 'rgba(13,148,136,0.3)', color: T.teal, background: 'rgba(255,255,255,0.5)' }}
                >
                  <Users size={14} />
                  For Clinicians
                </button>
              </div>

              {/* Trust row */}
              <div className="flex flex-wrap gap-6">
                {[
                  { Icon: ShieldCheck, label: 'HIPAA Ready' },
                  { Icon: Activity,    label: 'Evidence-Based' },
                  { Icon: Brain,       label: 'AI-Powered' },
                ].map(({ Icon, label }) => (
                  <div key={label} className="flex items-center gap-2 text-sm font-medium" style={{ color: T.muted }}>
                    <Icon size={15} style={{ color: T.teal }} strokeWidth={2} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Right: Fluency Profile Card ── */}
            <div className="flex justify-center lg:justify-end">
              <div
                className="w-full max-w-sm bg-white rounded-2xl p-7"
                style={{ boxShadow: '0 20px 60px rgba(15,23,42,0.12), 0 4px 16px rgba(13,148,136,0.08)' }}
              >
                {/* Card header */}
                <div className="flex items-center justify-between mb-7">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#F0FDF9' }}>
                      <Activity size={18} style={{ color: T.teal }} />
                    </div>
                    <div>
                      <p className="font-bold text-sm" style={{ color: T.navy }}>Fluency Profile</p>
                      <p className="text-xs mt-0.5" style={{ color: T.muted }}>Subject #8492-A</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider"
                    style={{ background: '#F0FDF4', color: '#16A34A' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse inline-block" />
                    Active
                  </span>
                </div>

                {/* Metric 1 */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: T.muted }}>Syllables Spoken</span>
                    <span className="text-sm font-bold" style={{ color: T.navy }}>1,248</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        '--bar-w': '82%',
                        width: '82%',
                        background: 'linear-gradient(90deg,#0D9488,#0891B2)',
                      }}
                    />
                  </div>
                </div>

                {/* Metric 2 */}
                <div className="mb-7">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm" style={{ color: T.muted }}>Disfluency Rate</span>
                    <span className="text-sm font-bold" style={{ color: T.teal }}>4.2%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E5E7EB' }}>
                    <div
                      className="h-full rounded-full bar-fill"
                      style={{
                        '--bar-w': '18%',
                        width: '18%',
                        background: 'linear-gradient(90deg,#0D9488,#14B8A6)',
                      }}
                    />
                  </div>
                </div>

                {/* Session list */}
                <div className="border-t pt-5" style={{ borderColor: '#F3F4F6' }}>
                  <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: T.muted }}>Recent Sessions</p>
                  {[
                    { date: 'May 9, 2025',  score: '94/100', delta: '+3' },
                    { date: 'May 7, 2025',  score: '91/100', delta: '+6' },
                    { date: 'May 5, 2025',  score: '85/100', delta: '+5' },
                  ].map(({ date, score, delta }) => (
                    <div key={date} className="flex items-center justify-between py-2 border-b last:border-b-0" style={{ borderColor: '#F9FAFB' }}>
                      <span className="text-xs" style={{ color: T.muted }}>{date}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ color: T.navy }}>{score}</span>
                        <span className="text-xs font-bold px-1.5 py-0.5 rounded" style={{ background: '#F0FDF4', color: '#16A34A' }}>{delta}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="py-28 bg-white">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-20 reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: T.teal }}>
              Precision Tools
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-5" style={{ color: T.navy }}>
              Diagnostic Capabilities
            </h2>
            <p className="text-lg max-w-xl mx-auto leading-relaxed" style={{ color: T.muted }}>
              State-of-the-art acoustic modeling engineered for precise, objective
              measurements of speech patterns in clinical and home environments.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 lg:gap-16">
            {[
              {
                Icon:  Microscope,
                title: 'Acoustic Precision',
                desc:  'High-fidelity audio processing capable of isolating micro-stutters, prolongations, and blockages with clinical accuracy.',
              },
              {
                Icon:  Brain,
                title: 'Cognitive Processing',
                desc:  'Advanced natural language models that contextually analyze speech disfluencies without relying on rigid linguistic rules.',
              },
              {
                Icon:  ClipboardList,
                title: 'Objective Reporting',
                desc:  'Automated generation of detailed session transcripts and quantitative metric reports for therapeutic review.',
              },
            ].map(({ Icon, title, desc }) => (
              <div key={title} className="reveal group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:scale-110"
                  style={{ background: '#F0FDF9', border: '1px solid rgba(13,148,136,0.12)' }}
                >
                  <Icon size={26} style={{ color: T.teal }} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-black mb-3" style={{ color: T.navy }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: T.text }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WORKFLOW (dark) ═══════════════ */}
      <section
        id="how-it-works"
        className="py-28 relative overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #0A1628 0%, #0F2744 50%, #0A1628 100%)' }}
      >
        {/* Subtle grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        {/* Teal ambient light */}
        <div
          className="absolute top-0 right-1/4 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(13,148,136,0.15) 0%, transparent 65%)' }}
        />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="mb-16 reveal">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: T.teal }}>
              Process
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Clinical Workflow</h2>
          </div>

          {/* Steps */}
          <div className="relative reveal">
            {/* Connector line */}
            <div
              className="hidden md:block absolute left-[2.5rem] right-[2.5rem] step-line"
              style={{ top: '2rem', height: 2, opacity: 0.5 }}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
              {[
                { n: '01', title: 'Capture',  desc: 'Securely record patient audio in clinical or home settings.' },
                { n: '02', title: 'Analyze',  desc: 'AI engine processes phonemes and detects irregular fluency events.' },
                { n: '03', title: 'Evaluate', desc: 'Review quantitative data via the secure clinician dashboard.' },
                { n: '04', title: 'Adapt',    desc: 'Adjust therapy protocols based on objective longitudinal trends.' },
              ].map(({ n, title, desc }, i) => (
                <div key={n}>
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black mb-6 border-2"
                    style={{
                      background: i === 0
                        ? 'linear-gradient(135deg,#0D9488,#0891B2)'
                        : 'rgba(255,255,255,0.07)',
                      borderColor: i === 0 ? 'transparent' : 'rgba(255,255,255,0.15)',
                      color: i === 0 ? '#fff' : 'rgba(255,255,255,0.5)',
                    }}
                  >{n}</div>
                  <h4 className="text-lg font-black text-white mb-2">{title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS STRIP ═══════════════ */}
      <section className="py-16 bg-white border-b" style={{ borderColor: T.border }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
            {[
              { val: '98%',  label: 'Transcription accuracy' },
              { val: '< 3s', label: 'Time to results' },
              { val: '12k+', label: 'Active patients' },
              { val: '40+',  label: 'Countries served' },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <p
                  className="text-4xl font-black mb-1"
                  style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}
                >{val}</p>
                <p className="text-sm font-medium" style={{ color: T.muted }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIAL ═══════════════ */}
      <section className="py-24" style={{ background: T.light }}>
        <div className="max-w-3xl mx-auto px-6 text-center reveal">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: '#F0FDF9', border: '1px solid rgba(13,148,136,0.15)' }}
          >
            <ShieldCheck size={26} style={{ color: T.teal }} />
          </div>
          <blockquote className="text-2xl lg:text-3xl font-bold leading-relaxed mb-8" style={{ color: T.navy }}>
            "The objective data on my pauses changed how my therapist and I work together.
            For the first time we had real numbers to act on. Our sessions became
            twice as effective within a month."
          </blockquote>
          <div className="flex items-center justify-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
            >D</div>
            <div className="text-left">
              <p className="text-sm font-bold" style={{ color: T.navy }}>David K.</p>
              <p className="text-xs" style={{ color: T.muted }}>University Student · Using FluentAI for 6 months</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ CTA ═══════════════ */}
      <section className="cta-gradient py-28">
        <div className="max-w-2xl mx-auto px-6 text-center reveal">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-8 bg-white"
            style={{ boxShadow: '0 4px 20px rgba(13,148,136,0.15)' }}
          >
            <ShieldCheck size={30} style={{ color: T.teal }} />
          </div>
          <h2 className="text-4xl lg:text-5xl font-black mb-5 leading-tight" style={{ color: T.navy }}>
            Elevate Speech Therapy<br />
            with <span style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Objective Data</span>
          </h2>
          <p className="text-lg mb-10 leading-relaxed" style={{ color: T.text }}>
            Join leading Speech-Language Pathologists and research institutions
            leveraging AI for precise fluency measurement and therapy tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/register')}
              className="h-14 px-10 rounded-xl font-bold text-white text-base transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ background: T.navy }}
            >
              Request Platform Access
            </button>
            <button
              className="h-14 px-10 rounded-xl font-semibold text-base border-2 bg-white transition-all hover:bg-slate-50 active:scale-[0.98]"
              style={{ borderColor: T.border, color: T.navy }}
            >
              View Clinical Studies
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
