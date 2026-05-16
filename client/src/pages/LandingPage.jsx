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
  teal: '#0D9488',
  tealMid: '#0891B2',
  navy: '#0F172A',
  text: '#374151',
  muted: '#6B7280',
  border: '#E5E7EB',
  light: '#F8FAFC',
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
      <section className="hero-gradient min-h-[80vh] flex items-center pt-32 pb-20 lg:pt-40 lg:pb-0">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── Left ── */}
            <div>
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
                  { Icon: Activity, label: 'Evidence-Based' },
                  { Icon: Brain, label: 'AI-Powered' },
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
                    { date: 'May 9, 2025', score: '94/100', delta: '+3' },
                    { date: 'May 7, 2025', score: '91/100', delta: '+6' },
                    { date: 'May 5, 2025', score: '85/100', delta: '+5' },
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
      <section id="features" className="py-20 bg-[#ECFEFF]">
        <div className="max-w-6xl mx-auto px-6">

          <div className="text-center mb-16 reveal">
            <p className="text-[10px] font-black tracking-[0.3em] uppercase mb-3" style={{ color: T.teal }}>
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
                Icon: Microscope,
                title: 'Acoustic Precision',
                desc: 'High-fidelity audio processing capable of isolating micro-stutters, prolongations, and blockages with clinical accuracy.',
              },
              {
                Icon: Brain,
                title: 'Cognitive Processing',
                desc: 'Advanced natural language models that contextually analyze speech disfluencies without relying on rigid linguistic rules.',
              },
              {
                Icon: ClipboardList,
                title: 'Objective Reporting',
                desc: 'Automated generation of detailed session transcripts and quantitative metric reports for therapeutic review.',
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
        className="py-20 relative overflow-hidden"
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
          <div className="mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4" style={{ color: T.teal }}>
              Process
            </p>
            <h2 className="text-4xl lg:text-5xl font-black text-white">Clinical Workflow</h2>
          </div>

          {/* ── Neural Workflow Redesign ── */}
          <div className="relative">

            {/* Gradient Connector Path - Perfectly centered between icons */}
            <div className="hidden md:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-[2px] z-0">
              <div className="w-full h-full bg-white/10 relative overflow-hidden rounded-full">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-teal-300 to-transparent w-full animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
              </div>
              {/* Glowing start dot centered on Icon 01 */}
              <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-teal-400 shadow-[0_0_15px_rgba(45,212,191,0.8)] z-10" />
              {/* Ending dot centered on Icon 04 */}
              <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white/20 z-10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {[
                { n: '01', title: 'Capture', desc: 'Securely record patient audio in clinical or home settings.', icon: Microscope },
                { n: '02', title: 'Analyze', desc: 'AI engine processes phonemes and detects irregular fluency events.', icon: Brain },
                { n: '03', title: 'Evaluate', desc: 'Review quantitative data via the secure clinician dashboard.', icon: BarChart3 },
                { n: '04', title: 'Adapt', desc: 'Adjust therapy protocols based on objective longitudinal trends.', icon: Zap },
              ].map(({ n, title, desc, icon: Icon }, i) => (
                <div key={n} className="group relative">

                  {/* Step Indicator */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-10">
                      {/* Pulse Effect for active step */}
                      {i === 0 && (
                        <div className="absolute inset-0 rounded-3xl bg-teal-500/20 animate-ping" />
                      )}

                      <div
                        className={`w-20 h-20 rounded-3xl flex items-center justify-center relative z-10 border transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl group-hover:shadow-teal-500/20 
                           ${i === 0
                            ? 'bg-teal-600 border-teal-400 text-white shadow-xl shadow-teal-500/20'
                            : 'bg-white/5 border-white/10 text-slate-400 hover:border-teal-500/50 hover:bg-white/10'}`}
                      >
                        <div className="flex flex-col items-center leading-none">
                          <Icon size={24} className={i === 0 ? 'text-white' : 'text-teal-500/60'} strokeWidth={1.5} />
                          <span className="text-[10px] font-black mt-2 opacity-60 tracking-widest uppercase">{n}</span>
                        </div>
                      </div>
                    </div>

                    {/* Text Content */}
                    <div className="transition-transform duration-500 group-hover:translate-y-[-4px]">
                      <h4 className={`text-xl font-black mb-3 tracking-tight ${i === 0 ? "text-white" : "text-slate-200"}`}>
                        {title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-400 font-medium max-w-[200px]">
                        {desc}
                      </p>
                    </div>
                  </div>

                  {/* Mobile separator */}
                  {i < 3 && <div className="md:hidden w-px h-12 bg-gradient-to-b from-teal-500/50 to-transparent mx-auto my-6" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS STRIP ═══════════════ */}
      <section className="py-16 bg-[#ECFEFF] border-b" style={{ borderColor: T.border }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 reveal">
            {[
              { val: '98%', label: 'Transcription accuracy' },
              { val: '< 3s', label: 'Time to results' },
              { val: '12k+', label: 'Active patients' },
              { val: '40+', label: 'Countries served' },
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

      {/* ═══════════════ ABOUT SECTION (REIMAGINED PREMIUM) ═══════════════ */}
      <section id="about" className="py-24 bg-[#ECFEFF] relative overflow-hidden">
        {/* Decorative backdrop elements */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-6 relative">
          <div className="grid lg:grid-cols-12 gap-16 items-start">

            {/* Left: Narrative (7 cols) */}
            <div className="lg:col-span-7">
              <h2 className="text-5xl lg:text-6xl font-black mb-10 leading-[1.05] tracking-tight" style={{ color: T.navy }}>
                Pioneering the next era of <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-teal-700">Acoustic Diagnostics.</span>
              </h2>

              <div className="max-w-xl">
                <p className="text-xl leading-relaxed text-slate-600 mb-10 font-medium">
                  FluentAI was established to bridge the critical gap between clinical expertise and objective data. We empower clinicians with high-fidelity acoustic insights that were previously inaccessible.
                </p>

                <div className="pl-6 border-l-2 border-teal-500/20 mb-12 italic text-slate-500 font-serif text-lg leading-relaxed">
                  "Our founding mandate is to provide every individual who stutters with the clarity of evidence-based progress, moving beyond subjective assessment to objective mastery."
                </div>

                <div className="grid sm:grid-cols-2 gap-8">
                  {[
                    { title: 'Validated Models', desc: 'Acoustic engines trained on diverse phonemic data sets.' },
                    { title: 'Clinical Trust', desc: 'Built in collaboration with leading SLP research institutions.' }
                  ].map(item => (
                    <div key={item.title}>
                      <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                        {item.title}
                      </h4>
                      <p className="text-sm leading-relaxed text-slate-500">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Institutional Card (5 cols) */}
            <div className="lg:col-span-5">
              <div className="sticky top-32">
                <div className="bg-slate-50/50 backdrop-blur-sm border border-slate-200/60 rounded-[32px] p-8 lg:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-teal-500/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-110 transition-transform duration-1000" />

                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100 mb-8">
                    <ShieldCheck size={28} className="text-teal-600" />
                  </div>

                  <h3 className="text-2xl font-black mb-4" style={{ color: T.navy }}>Institutional Integrity</h3>
                  <p className="text-sm leading-relaxed text-slate-500 mb-8">
                    We maintain rigorous standards for data security and clinical validity, ensuring our platform is ready for the most demanding healthcare environments.
                  </p>

                  <ul className="space-y-4">
                    {[
                      { icon: Activity, text: 'HIPAA & GDPR Secure Cloud' },
                      { icon: Microscope, text: 'Sub-Millisecond Event Detection' },
                      { icon: Users, text: 'Clinician-Validated Reporting' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 p-3.5 bg-white/60 rounded-2xl border border-slate-100/50 hover:bg-white transition-colors cursor-default">
                        <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center text-teal-600 shrink-0">
                          <item.icon size={16} />
                        </div>
                        <span className="text-xs font-bold text-slate-700 uppercase tracking-tight">{item.text}</span>
                      </li>
                    ))}
                  </ul>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS (HCI COMPLIANT GRID) ═══════════════ */}
      <section className="py-32 relative overflow-hidden bg-white">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(#0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl lg:text-5xl font-black mb-5 tracking-tight text-slate-900">
              Trusted by the <span className="text-teal-600">Speech Community.</span>
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">
              Join thousands of professionals and patients leveraging clinical data to master fluency.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-10">
            {[
              {
                quote: "The objective data on pauses changed how my therapist and I work together. We finally had real numbers to act on.",
                author: "David K.",
                role: "Verified Patient",
                duration: "6 Months with FluentAI",
                initial: "D"
              },
              {
                quote: "As an SLP, I've never had this level of precision. It saves me hours of manual transcription while increasing diagnostic accuracy.",
                author: "Sarah L.",
                role: "Clinical Specialist",
                duration: "Top Tier Medical Center",
                initial: "S"
              },
              {
                quote: "Our research department uses FluentAI for longitudinal studies. The acoustic models are the most reliable we've tested.",
                author: "Dr. James R.",
                role: "Research Director",
                duration: "University Speech Lab",
                initial: "J"
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-50/50 border border-slate-200/60 p-8 lg:p-10 rounded-[32px] flex flex-col h-full hover:bg-white hover:shadow-2xl hover:shadow-slate-200/50 transition-all duration-500 group">
                <div className="flex-1">
                  <div className="text-teal-500 mb-6 opacity-30 group-hover:opacity-100 transition-opacity">
                    <svg width="32" height="24" viewBox="0 0 32 24" fill="currentColor">
                      <path d="M0 24L8 8H0V0H12V10L6 24H0ZM20 24L28 8H20V0H32V10L26 24H20Z" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium leading-relaxed text-slate-700 mb-8 font-serif italic">
                    "{item.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-8 border-t border-slate-100">
                  <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 flex items-center justify-center text-white text-sm font-black shadow-lg">
                      {item.initial}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-50">
                      <ShieldCheck size={10} className="text-teal-600" />
                    </div>
                  </div>
                  <div>
                    <p className="font-black text-slate-900 leading-tight">{item.author}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">{item.role}</span>
                      <div className="w-1 h-1 rounded-full bg-slate-300" />
                      <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{item.duration}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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
