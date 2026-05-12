import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, RefreshCw, Info } from 'lucide-react';
import Card from '../components/shared/Card';
import Button from '../components/shared/Button';
import { motion } from 'framer-motion';

const MOCK_SUGGESTIONS = [
  'How can I reduce repetitions?',
  'What should I practice today?',
  'Explain my fluency score'
];

const MOCK_HISTORY = [
  { id: 1, role: 'ai', content: 'Hello! I am your speech fluency assistant. How can I help you analyze your progress today?' },
  { id: 2, role: 'user', content: 'What should I practice today?' },
  { id: 3, role: 'ai', content: 'Based on your recent sessions, I recommend focusing on the /r/ sound and working on reducing your speaking rate slightly. Your average WPM has been high at 124, which may be contributing to the repetitions. Would you like me to generate a practice exercise for this?' }
];

const AiAssistant = () => {
  const [messages, setMessages] = useState(MOCK_HISTORY);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const newMessage = { id: Date.now(), role: 'user', content: input };
    setMessages((prev) => [...prev, newMessage]);
    setInput('');
    setIsTyping(true);

    // Mock AI response
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        content: 'I understand. I am a mock AI assistant for this demonstration, but in the production version, I will analyze your specific phoneme data to give tailored advice.'
      }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    // Optionally auto-send:
    // setTimeout(() => handleSend(), 0); 
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col h-[calc(100vh-160px)] md:h-[calc(100vh-110px)]"
    >
      {/* Header Area */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 text-primary rounded-xl flex items-center justify-center">
            <Bot size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-navy tracking-tight">AI Assistant</h1>
            <p className="text-xs text-slate-500">Your personal speech fluency coach</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setMessages([MOCK_HISTORY[0]])}>
          <RefreshCw size={16} className="mr-2" /> New Chat
        </Button>
      </div>

      <Card padded={false} className="flex-1 flex flex-col overflow-hidden border border-slate-200 shadow-xl shadow-navy/5">
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
          <div className="text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 px-3 py-1 rounded-full">
              Today
            </span>
          </div>

          {messages.map((msg) => (
            <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'ai' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {msg.role === 'ai' ? <Bot size={16} /> : <User size={16} />}
              </div>
              <div className={`max-w-[75%] px-5 py-3.5 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'bg-navy text-white rounded-2xl rounded-tr-sm' 
                  : 'bg-white text-navy rounded-2xl rounded-tl-sm border border-slate-100 shadow-sm'
              }`}>
                {msg.content}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shrink-0">
                <Bot size={16} />
              </div>
              <div className="bg-white border border-slate-100 shadow-sm rounded-2xl rounded-tl-sm px-5 py-4 flex gap-1">
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-1.5 h-1.5 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggested Prompts */}
        {messages.length < 3 && !isTyping && (
          <div className="px-6 pb-2 bg-slate-50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-center">Suggested Topics</p>
            <div className="flex flex-wrap justify-center gap-2">
              {MOCK_SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSuggestionClick(s)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 px-3 py-1.5 rounded-full hover:border-primary hover:text-primary transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 bg-white border-t border-slate-100">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your speech progress..."
              className="w-full bg-slate-50 border border-slate-200 rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
            >
              <Send size={14} className="ml-0.5" />
            </button>
          </form>
          <div className="flex items-center justify-center gap-1.5 mt-3 text-[10px] text-slate-400">
            <Info size={12} />
            <span>AI responses are for guidance only, not clinical advice.</span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default AiAssistant;
