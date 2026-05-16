import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen w-full flex bg-[#ECFEFF] relative overflow-hidden">

      {/* ── Left Side: Institutional Hero (Desktop Only) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-16">
        {/* Background Depth & AI Imagery */}
        <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, #0D2A35 0%, #0F172A 100%)' }} />
        <img 
          src="file:///C:/Users/hasni/.gemini/antigravity/brain/b4ad2456-e786-40b7-8e37-cda2e35b5bb2/fluent_ai_hero_viz_1778881707290.png" 
          alt="AI Visualization" 
          className="absolute inset-0 w-full h-full object-cover opacity-20 blur-[5px] mix-blend-overlay"
        />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute -bottom-48 -right-24 w-[500px] h-[500px] bg-sky-500/10 rounded-full blur-[120px]" />

        {/* Content */}
        <div className="relative z-10 max-w-md">
          <Link to="/" className="inline-flex items-center gap-4 mb-16 group">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-teal-500/30 transition-transform group-hover:scale-110"
              style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}>F</div>
            <span className="font-black text-2xl tracking-tighter text-white">FluentAI</span>
          </Link>

          <h2 className="text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
            Elevating the standard of <span className="text-teal-400">clinical fluency</span> monitoring.
          </h2>

          <p className="text-lg text-slate-400 leading-relaxed mb-12 font-medium">
            Join thousands of clinicians and patients using objective AI data to transform stuttering therapy and progress tracking.
          </p>

          <div className="grid grid-cols-2 gap-8">
            {[
              { label: 'Evidence-Based', desc: 'Clinical Grade' },
              { label: 'HIPAA Ready', desc: 'Secure Data' }
            ].map(item => (
              <div key={item.label} className="group/item">
                <p className="text-white font-black text-lg mb-1 group-hover/item:text-teal-400 transition-colors">{item.label}</p>
                <p className="text-teal-500/80 text-xs font-black uppercase tracking-[0.2em]">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Side: Auth Form ── */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 bg-white">
        {/* HCI-Friendly Subtle Image Backdrop */}
        <div className="absolute bottom-0 right-0 w-full h-full pointer-events-none overflow-hidden opacity-[0.07] z-0">
          <img 
            src="file:///C:/Users/hasni/.gemini/antigravity/brain/b4ad2456-e786-40b7-8e37-cda2e35b5bb2/auth_secure_ai_visual_1778881933711.png" 
            alt="Secure AI Backdrop" 
            className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[120%] object-contain"
          />
        </div>

        {/* Decorative Grid */}
        <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#0D9488 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

        <div className="w-full max-w-[440px] relative z-10">
          {/* Mobile Logo Only */}
          <div className="lg:hidden flex justify-center mb-10">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black text-base shadow-sm"
                style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}>F</div>
              <span className="font-black text-2xl tracking-tighter" style={{ color: '#0F172A' }}>FluentAI</span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-4xl font-black mb-3 tracking-tight text-slate-900">{title}</h1>
            <p className="text-base font-bold text-slate-400">{subtitle}</p>
          </div>

          {/* Card */}
          <div className="bg-white/95 backdrop-blur-md rounded-[40px] p-8 sm:p-10 border border-slate-100 shadow-[0_40px_100px_-20px_rgba(15,23,42,0.1),0_0_1px_rgba(13,148,136,0.2)]">
            {children}
          </div>
        </div>
      </div>


    </div>
  );
};

export default AuthLayout;
