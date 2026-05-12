import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const LINKS = [
  { label: 'Features',     href: '#features'    },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'About',        href: '#about'        },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.96)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E5E7EB' : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 16px rgba(0,0,0,0.06)' : 'none',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => navigate('/')} className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg,#0D9488,#14B8A6)' }}
          >F</div>
          <span className="font-bold text-lg" style={{ color: '#0F172A' }}>FluentAI</span>
        </button>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate('/login')}
            className="h-9 px-5 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >Log In</button>
          <button
            onClick={() => navigate('/register')}
            className="h-9 px-5 text-sm font-bold text-white rounded-full transition-all hover:opacity-90 shadow-sm"
            style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}
          >Get Started</button>
        </div>

        {/* Mobile */}
        <button className="md:hidden p-1.5 text-slate-600" onClick={() => setOpen(v => !v)}>
          {open ? <X size={20}/> : <Menu size={20}/>}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-5 flex flex-col gap-4">
          {LINKS.map(l => (
            <a key={l.label} href={l.href}
              className="text-sm font-medium text-slate-600"
              onClick={() => setOpen(false)}>{l.label}</a>
          ))}
          <div className="flex gap-3 pt-3 border-t border-slate-100">
            <button onClick={() => navigate('/login')}
              className="flex-1 h-10 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg">
              Log In
            </button>
            <button onClick={() => navigate('/register')}
              className="flex-1 h-10 text-sm font-bold text-white rounded-lg"
              style={{ background: 'linear-gradient(135deg,#0D9488,#0891B2)' }}>
              Get Started
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
