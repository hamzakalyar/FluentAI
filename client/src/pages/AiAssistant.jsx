import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  ShieldCheck,
  Activity,
  Target,
  Zap,
  FileText,
  BrainCircuit,
  Plus,
  BarChart2,
  BookOpen,
  Waves,
  Clock,
  SlidersHorizontal,
  ChevronRight,
  ClipboardList,
  Quote,
  MessageSquare,
  Settings,
  Layout,
  Mic,
} from 'lucide-react';
import Breadcrumb from '../components/layout/Breadcrumb';

// ── Static chat history ──────────────────────────────────────────────────────
const HISTORY_ITEMS = [
  { id: 1, icon: BarChart2, title: 'Weekly Progress Review', sub: '2 min ago', color: 'text-teal-500', bg: 'bg-teal-500/10' },
  { id: 2, icon: BookOpen, title: 'Tuesday Practice Tips', sub: 'Yesterday', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 3, icon: Waves, title: 'Phoneme Analysis', sub: 'May 12', color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
  { id: 4, icon: Target, title: 'Goal Setting Session', sub: 'May 10', color: 'text-rose-500', bg: 'bg-rose-500/10' },
];

// ── Right-panel data (mirrors RecordingStudio right panel style) ─────────────
const SESSION_ANALYTICS = [
  { icon: Activity, label: 'Stability', val: '92.0%', iconColor: 'text-teal-500', valColor: 'text-teal-600' },
  { icon: Zap, label: 'Resonance', val: 'Optimal', iconColor: 'text-amber-500', valColor: 'text-[var(--text-primary)]' },
  { icon: Target, label: 'Modality', val: 'Fluency', iconColor: 'text-indigo-500', valColor: 'text-[var(--text-primary)]' },
];

const SUGGESTED_ACTIONS = [
  { icon: ClipboardList, label: 'Generate Exercise Plan' },
  { icon: Waves, label: 'Analyze Latency Jitter' },
  { icon: FileText, label: 'Export Clinical Summary' },
  { icon: BarChart2, label: 'Week-over-Week Report' },
];

const MODEL_INFO = [
  { key: 'Model version', val: 'C3-Clinical' },
  { key: 'Sessions analyzed', val: '14' },
  { key: 'Context window', val: '4 sessions' },
];

// ── Suggestion chips ─────────────────────────────────────────────────────────
const CHIPS = [
  'Summarize my last session',
  'What are my fluency patterns?',
  'Generate practice exercises',
  'Compare with last week',
];

// ── Initial messages ─────────────────────────────────────────────────────────
const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content:
      'Welcome to the FluentAI Intelligence Hub. I have analyzed your 14 recent sessions. Your resonance stability is showing a 12% upward trend in the last 48 hours. Shall we start a targeted practice set for your weak phonemes?',
    time: '09:00 AM',
    isInsight: false,
  },
  {
    id: 2,
    role: 'user',
    content: 'Summarize my last session',
    time: '09:14 AM',
  },
  {
    id: 3,
    role: 'ai',
    content:
      'Analysis complete. Your block duration has decreased by 12% since Tuesday — that\'s meaningful progress. Speech rate held steady at 108 WPM. Shall we start a targeted practice set for /p/ and /b/ sounds?',
    time: '09:14 AM',
    isInsight: true,
  },
];

// ── AI response pool ──────────────────────────────────────────────────────────
const AI_RESPONSES = [
  'Your phoneme stability during plosive transitions has reached an optimal 92% confidence interval. I\'ve updated your clinical roadmap to prioritize secondary glottal onset exercises.',
  'Based on your last 4 sessions, your speech rate has improved by 8% and repetitions decreased by 12%. Keep up the consistent practice schedule.',
  'I recommend focusing on your /s/ and /r/ sounds today. Your fluency score is trending upward — you\'re 3 sessions away from your weekly goal.',
  'Your block events dropped from 7 to 3 this week. The targeted /p/ exercises are working. Shall I generate a new difficulty level for tomorrow?',
];

// ════════════════════════════════════════════════════════════════════════════
const AiAssistant = () => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeHistoryId, setActiveHistoryId] = useState(1);
  const chatEndRef = useRef(null);
  const aiResponseIndex = useRef(0);

  // ── FIX: Ensure page starts at top on mount ────────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Auto-scroll on new message
  useEffect(() => {
    // We only want to scroll the chat container, not the window
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isTyping]);

  const sendMessage = (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: trimmed,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const responseText = AI_RESPONSES[aiResponseIndex.current % AI_RESPONSES.length];
      aiResponseIndex.current += 1;

      const aiMsg = {
        id: Date.now() + 1,
        role: 'ai',
        content: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isInsight: aiResponseIndex.current % 3 === 0,
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    sendMessage();
  };

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="animate-fade-in-up relative h-[calc(100vh-130px)] transition-colors duration-300 overflow-hidden flex flex-col">
      {/* Background Decor - Ultra Minimal */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--accent)]/5 rounded-full blur-[120px] -z-10 pointer-events-none opacity-30" />

      {/* ── INSTITUTIONAL HEADER ── */}
      <div className="mb-8 shrink-0">
        <Breadcrumb />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-2xl font-black text-[var(--text-primary)] tracking-tight font-syne">AI Clinical Assistant</h1>
            <p className="text-[var(--text-secondary)] font-medium text-sm mt-2">Intelligent synthesis of speech data and session metrics.</p>
          </div>
        </div>
      </div>

      {/* ── MAIN WORKSPACE ── */}
      <div className="flex flex-1 gap-8 min-h-0 overflow-hidden">

        {/* ── Sidebar (Compact) ── */}
        <div className="hidden lg:flex flex-col w-[240px] flex-shrink-0 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] overflow-hidden">
          <div className="p-4 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/50">
            <h3 className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest flex items-center gap-2">
              <Clock size={13} />
              Recent Threads
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {HISTORY_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveHistoryId(item.id)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-left ${
                  activeHistoryId === item.id 
                    ? 'bg-[var(--bg-elevated)] border border-[var(--border-subtle)] shadow-sm' 
                    : 'hover:bg-[var(--bg-elevated)]/50 border border-transparent'
                }`}
              >
                <div className={`p-2 rounded-lg ${item.color} bg-current bg-opacity-10 shrink-0`}>
                  <item.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`block text-[12px] font-bold truncate ${
                    activeHistoryId === item.id ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'
                  }`}>
                    {item.title}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)] font-black uppercase block">{item.sub}</span>
                </div>
              </button>
            ))}
          </div>

          <div className="p-3 border-t border-[var(--border-subtle)]">
            <button className="w-full py-2.5 px-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-xl flex items-center justify-center gap-2 hover:bg-[var(--bg-elevated)] transition-all">
              <Plus size={14} className="text-[var(--text-primary)]" />
              <span className="text-[10px] font-black text-[var(--text-primary)] uppercase tracking-widest">New Session</span>
            </button>
          </div>
        </div>

        {/* ── Main Chat Area (High Density) ── */}
        <div className="flex-1 flex flex-col bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-[24px] overflow-hidden shadow-sm">
          {/* Header */}
          <div className="px-6 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-base)]/20 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-500 border border-teal-500/20">
                <Bot size={18} />
              </div>
              <div>
                <h2 className="text-[13px] font-bold text-[var(--text-primary)] leading-none tracking-tight">Clinical Assistant</h2>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] rounded-lg transition-all">
                <SlidersHorizontal size={16} />
              </button>
              <button className="p-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-base)] rounded-lg transition-all">
                <FileText size={16} />
              </button>
            </div>
          </div>

          {/* Messages (Density Optimized) */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-3xl mx-auto space-y-5">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                  <div className={`max-w-[80%] flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl border transition-all ${
                      msg.role === 'user' 
                        ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 border-indigo-500 text-white rounded-tr-none shadow-md shadow-indigo-500/10' 
                        : msg.isInsight 
                          ? 'bg-[var(--bg-elevated)] border-teal-500/30 text-[var(--text-primary)] rounded-tl-none ring-1 ring-teal-500/10 shadow-sm'
                          : 'bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] rounded-tl-none shadow-sm'
                    }`}>
                      {msg.isInsight && (
                        <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[var(--border-subtle)]">
                          <Activity size={13} className="text-teal-500" />
                          <span className="text-[9px] font-black text-teal-500 uppercase tracking-widest">Clinical insight</span>
                        </div>
                      )}
                      <p className="text-[14px] leading-relaxed font-medium">{msg.content}</p>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 px-1 opacity-50">
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase">{msg.time}</span>
                      <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-tighter">
                        {msg.role === 'user' ? 'Hassan' : 'AI'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start animate-fade-in">
                  <div className="bg-[var(--bg-elevated)] border border-[var(--border-subtle)] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
                    </div>
                    <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Input Area (Compact Hub) */}
          <div className="px-6 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-elevated)]/30 backdrop-blur-md">
            <div className="flex items-center gap-2 mb-3 overflow-x-auto no-scrollbar max-w-3xl mx-auto">
              {CHIPS.map((chip, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 bg-[var(--bg-surface)] border border-[var(--border-subtle)] rounded-lg text-[11px] font-bold text-[var(--text-secondary)] whitespace-nowrap hover:bg-[var(--bg-elevated)] transition-all shadow-sm"
                >
                  {chip}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="relative flex items-center gap-3 max-w-3xl mx-auto w-full">
              <div className="relative flex-1 group">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Optimize clinical thread..."
                  className="w-full bg-[var(--bg-base)] border border-[var(--border-subtle)] rounded-xl py-3.5 pl-5 pr-12 text-[14px] font-medium text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-indigo-500/50 transition-all shadow-inner"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  <button type="button" className="p-1.5 text-[var(--text-muted)] hover:text-indigo-400 transition-colors">
                    <Mic size={18} />
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={!input.trim()}
                className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 shrink-0"
              >
                <Send size={18} />
              </button>
            </form>
            <div className="flex items-center justify-center gap-2 mt-3 opacity-40">
              <ShieldCheck size={12} className="text-teal-500" />
              <span className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest">End-to-End Encrypted</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AiAssistant;