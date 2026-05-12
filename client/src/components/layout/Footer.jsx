import React from 'react';

const PLATFORM = ['Dashboard', 'Analytics', 'Practice', 'Reports'];
const LEGAL    = ['Privacy Policy', 'Terms of Service', 'Accessibility', 'HIPAA Compliance'];

export default function Footer() {
  return (
    <footer style={{ background: '#0A1628', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="max-w-6xl mx-auto px-6 pt-16 pb-8">

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}
              >F</div>
              <span className="font-bold text-base text-white">FluentAI</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Clinical-grade speech fluency monitoring and practice platform, designed to
              reduce cognitive load and provide actionable insights.
            </p>
          </div>

          {/* Platform */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Platform
            </p>
            <ul className="space-y-3">
              {PLATFORM.map(l => (
                <li key={l}>
                  <a href="#" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-bold uppercase tracking-widest mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
              Legal
            </p>
            <ul className="space-y-3">
              {LEGAL.map(l => (
                <li key={l}>
                  <a href="#" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.45)' }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.45)'}>
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div
          className="pt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} FluentAI Platform. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            Version 1.0.0
          </p>
        </div>

      </div>
    </footer>
  );
}
