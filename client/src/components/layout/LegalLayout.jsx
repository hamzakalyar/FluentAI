import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Info, Shield, Scale } from 'lucide-react';

const LegalLayout = ({ children, title, lastUpdated, sections = [] }) => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white flex overflow-hidden font-inter selection:bg-teal-100">
      
      {/* ── Fixed Sidebar (The Monolith) ── */}
      <aside className="w-[320px] h-screen fixed top-0 left-0 bg-[#0B0E14] border-r border-white/5 flex flex-col z-[100]">
        
        {/* Brand Section */}
        <div className="p-8 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3.5 group mb-8">
            <div className="w-10 h-10 flex items-center justify-center bg-teal-600 rounded-xl shadow-lg shadow-teal-500/10 transition-transform group-hover:scale-105">
               <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M3 12h1m3 0h1m3-4v8m4-10v12m4-8v4m3-4h1" />
               </svg>
            </div>
            <div>
              <p className="font-black text-xl tracking-tighter text-white">FluentAI</p>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-500/60">Institutional</p>
            </div>
          </Link>

          <Link 
            to="/" 
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white transition-all text-[11px] font-black uppercase tracking-widest border border-white/5"
          >
            <ArrowLeft size={14} />
            Back to Platform
          </Link>
        </div>

        {/* Navigation Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <div className="mb-10">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-6 px-1">Navigation Index</h4>
            <nav className="space-y-1">
               {sections.map(section => (
                  <a 
                    key={section.id} 
                    href={`#${section.id}`}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-teal-400 hover:bg-white/5 transition-all group"
                  >
                     <div className="w-1 h-1 rounded-full bg-slate-800 group-hover:bg-teal-500 transition-colors" />
                     {section.title}
                  </a>
               ))}
            </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-white/5">
             <Link to="/privacy" className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all ${location.pathname === '/privacy' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Privacy Policy</Link>
             <Link to="/terms" className={`block px-4 py-3 rounded-xl text-xs font-bold transition-all ${location.pathname === '/terms' ? 'bg-teal-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}>Terms of Service</Link>
          </div>
        </div>

        {/* Footer info in Sidebar */}
        <div className="p-8 border-t border-white/5">
           <div className="flex items-center gap-3 text-slate-500 mb-4">
              <Shield size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">v2.4 Certified</span>
           </div>
           <p className="text-[9px] font-medium text-slate-600 leading-relaxed uppercase tracking-widest">
              © {new Date().getFullYear()} FluentAI Clinical Systems.
           </p>
        </div>
      </aside>

      {/* ── Main Content Area (Scrollable) ── */}
      <main className="flex-1 ml-[320px] bg-white h-screen overflow-y-auto relative">
        
        {/* Header Strip */}
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Info size={16} className="text-teal-600" />
             <span className="text-xs font-black uppercase tracking-widest text-slate-400">Institutional Governance Portal</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest">
             Updated: {lastUpdated}
          </div>
        </header>

        {/* Document Content */}
        <article className="max-w-4xl mx-auto px-12 py-24">
           <div className="mb-20">
              <h1 className="text-6xl font-black text-slate-900 tracking-tightest leading-[1.05] mb-8">{title}</h1>
              <div className="h-1.5 w-24 bg-teal-600 rounded-full" />
           </div>

           <div className="prose prose-slate max-w-none 
             prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight 
             prose-p:text-slate-600 prose-p:text-lg prose-p:leading-relaxed prose-p:font-medium
             prose-strong:text-slate-900 prose-strong:font-black
             prose-li:text-slate-600 prose-li:text-lg prose-li:font-medium">
             {children}
           </div>
           
           <div className="mt-32 pt-16 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Institutional Publication 2026-A</p>
              <div className="flex items-center gap-8">
                 <div className="flex items-center gap-2">
                    <Scale size={14} className="text-slate-400" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Compliance Audit: Passed</span>
                 </div>
              </div>
           </div>
        </article>
      </main>

    </div>
  );
};

export default LegalLayout;
