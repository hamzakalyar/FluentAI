import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  MessageCircle, 
  Mail, 
  HelpCircle, 
  Cpu, 
  ShieldCheck, 
  Zap,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

const SupportCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    {
      icon: <Zap className="text-amber-500" />,
      title: 'Getting Started',
      description: 'Learn the basics of FluentAI and how to set up your first session.',
      articles: 12
    },
    {
      icon: <Cpu className="text-teal-500" />,
      title: 'AI & Accuracy',
      description: 'Understanding how our neural engine analyzes speech patterns.',
      articles: 8
    },
    {
      icon: <ShieldCheck className="text-blue-500" />,
      title: 'Security & Privacy',
      description: 'Our commitment to HIPAA compliance and data encryption.',
      articles: 5
    },
    {
      icon: <HelpCircle className="text-purple-500" />,
      title: 'Hardware Setup',
      description: 'Calibrating microphones and optimizing audio environments.',
      articles: 10
    }
  ];

  const faqs = [
    { q: "How accurate is the AI monitoring?", a: "FluentAI uses advanced acoustic modeling with 94%+ accuracy for stuttering detection in quiet environments." },
    { q: "Is my session data shared with anyone?", a: "No. Your data is encrypted and only accessible by you and authorized clinicians." },
    { q: "What hardware do I need?", a: "A standard high-quality USB microphone or built-in laptop mic is sufficient." }
  ];

  return (
    <div className="max-w-[1200px] mx-auto pb-20 animate-in fade-in duration-700">
      {/* ── HERO SECTION (HCI: Immediate Task Clarity) ── */}
      <section className="text-center py-16 mb-12 relative overflow-hidden rounded-[40px] bg-slate-900">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[80px]" />

        <div className="relative z-10 px-6">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">How can we help you?</h1>
          <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
            Search our knowledge base or browse categories below to find answers to your clinical and technical questions.
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="Search for articles, guides, and tutorials..."
              className="w-full h-16 pl-14 pr-6 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl text-white text-lg placeholder-slate-500 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID (HCI: Chunking for Mental Models) ── */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {categories.map((cat, idx) => (
          <div 
            key={idx} 
            className="group bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
          >
            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center mb-6 group-hover:bg-teal-50 transition-colors">
              {cat.icon}
            </div>
            <h3 className="text-lg font-black text-slate-900 mb-2">{cat.title}</h3>
            <p className="text-sm font-medium text-slate-500 leading-relaxed mb-6">{cat.description}</p>
            <div className="flex items-center justify-between mt-auto">
              <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">{cat.articles} Articles</span>
              <ChevronRight size={16} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* ── FAQS (HCI: Anticipatory Design) ── */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
            <BookOpen className="text-teal-600" />
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-teal-200 transition-colors group">
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
                  {faq.q}
                </h4>
                <p className="text-slate-600 text-sm leading-relaxed pl-3.5 border-l-2 border-transparent group-hover:border-teal-500 transition-all">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTACT SIDEBAR (HCI: Graceful Degradation) ── */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-teal-600 to-teal-700 rounded-[32px] p-8 text-white shadow-xl shadow-teal-900/10 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h2 className="text-xl font-black mb-4 relative z-10">Still need help?</h2>
            <p className="text-teal-100 text-sm mb-8 relative z-10">Our clinical support team is available 24/7 for technical and therapeutic assistance.</p>
            
            <div className="space-y-3 relative z-10">
              <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-white text-teal-700 font-black rounded-xl hover:bg-teal-50 transition-all shadow-sm">
                <MessageCircle size={18} />
                Live Chat Support
              </button>
              <button className="w-full flex items-center justify-center gap-3 py-3.5 bg-teal-500 text-white font-black rounded-xl hover:bg-teal-400 transition-all border border-teal-400/30">
                <Mail size={18} />
                Email Support
              </button>
            </div>
          </div>

          <div className="bg-slate-100 rounded-[32px] p-8 border border-slate-200/50">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-6">Developer Resources</h3>
            <div className="space-y-4">
              <a href="#" className="flex items-center justify-between text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors group">
                API Documentation
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </a>
              <a href="#" className="flex items-center justify-between text-slate-600 hover:text-slate-900 font-bold text-sm transition-colors group">
                Community Forums
                <ExternalLink size={14} className="opacity-0 group-hover:opacity-100 transition-all" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportCenter;
