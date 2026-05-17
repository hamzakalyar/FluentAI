import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Activity, Mail, Lock } from 'lucide-react';

const SECTIONS = [
  {
    title: 'Platform',
    links: [
      { label: 'Dashboard', to: '/dashboard' },
      { label: 'Analytics', to: '/analytics' },
      { label: 'Practice', to: '/practice' },
      { label: 'AI Assistant', to: '/assistant' }
    ]
  },
  {
    title: 'Institutional',
    links: [
      { label: 'Privacy', to: '/privacy' },
      { label: 'Terms', to: '/terms' },
      { label: 'HIPAA', to: '/privacy' },
      { label: 'Accessibility', to: '/help' }
    ]
  }
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0E14] border-t border-slate-800/40 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
          
          {/* ── Brand Compact ── */}
          <div className="max-w-xs">
            <Link to="/" className="flex items-center gap-2.5 mb-5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-lg shadow-teal-500/10"
                style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}>
                F
              </div>
              <span className="font-black text-xl tracking-tighter text-white">FluentAI</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed font-medium">
              Clinical-grade acoustic diagnostics for professional speech therapy and fluency monitoring. Designed to reduce cognitive load and provide actionable insights.
            </p>
          </div>

          {/* ── Navigation Compact ── */}
          <div className="flex gap-16 sm:gap-24">
            {SECTIONS.map(section => (
              <div key={section.title}>
                <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-teal-500 mb-5">
                  {section.title}
                </h4>
                <ul className="space-y-3">
                  {section.links.map(link => (
                    <li key={link.label}>
                      <Link to={link.to} className="text-slate-400 hover:text-white text-sm font-bold transition-colors">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* ── Security Mini ── */}
          <div className="bg-white/[0.03] border border-white/5 p-5 rounded-2xl max-w-[240px]">
              <div className="flex items-center gap-3 mb-3">
                 <ShieldCheck size={18} className="text-teal-500" />
                 <span className="text-[11px] font-black uppercase tracking-widest text-white">Secure System</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal font-medium mb-3">
                 HIPAA compliant end-to-end encrypted architecture.
              </p>
              <div className="flex items-center gap-2 text-teal-500/80">
                 <Lock size={12} />
                 <span className="text-[10px] font-black uppercase tracking-widest">AES-256 Certified</span>
              </div>
          </div>

        </div>

        {/* ── Bottom Strip ── */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
            <p className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">
              © {new Date().getFullYear()} FluentAI Platform.
            </p>
            <span className="hidden sm:inline text-[11px] text-slate-700">Version 1.0.0</span>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <Activity size={14} className="text-teal-500" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">System Live</span>
             </div>
             <div className="flex items-center gap-3">
                <a href="mailto:support@fluentai.com" className="p-1.5 bg-white/5 rounded-md cursor-pointer hover:bg-white/10 transition-colors">
                   <Mail size={14} className="text-slate-500" />
                </a>
             </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
