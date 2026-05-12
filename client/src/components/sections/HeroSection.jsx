import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Play, Shield, Lock, Star, Globe, Bot } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section 
      className="relative w-full min-h-screen flex items-center pt-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #F0F7FF 0%, #F8FAFC 60%, #F0FDFA 100%)'
      }}
    >
      {/* Subtle grid overlay */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%230F172A\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      />

      <div className="container max-w-[1200px] mx-auto px-6 relative z-10 py-12 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-8 items-center">
          
          {/* LEFT COLUMN - TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : -30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            {/* Eyebrow Label */}
            <div className="flex items-center gap-2 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-teal-500" />
              <span className="text-xs font-semibold text-cyan-600 uppercase tracking-[0.15em]">
                AI-Powered Speech Analysis Platform
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1] tracking-tight mb-6">
              Understand and Improve<br className="hidden md:block" />
              Your Speech Fluency<br className="hidden md:block" />
              with <span className="text-primary underline decoration-teal-400 decoration-4 underline-offset-4">Clinical AI</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg text-slate-600 leading-relaxed max-w-xl mb-6">
              Our AI analyzes your speech patterns in real-time, detecting disfluencies, measuring fluency metrics, and generating personalized practice exercises — all in a safe, non-judgmental environment.
            </p>

            {/* Social Proof Row */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
              <div className="flex items-center" aria-hidden="true">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-8 h-8 rounded-full bg-slate-300 border-2 border-white ${i !== 0 ? '-ml-2' : ''}`}
                  />
                ))}
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="text-sm text-slate-600 font-medium">Trusted by 10,000+ users worldwide</span>
                <div className="hidden sm:block w-1 h-1 rounded-full bg-slate-300" />
                <div className="flex items-center gap-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-700">4.9/5.0</span>
                </div>
              </div>
            </div>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button 
                onClick={() => navigate('/register')}
                className="h-14 px-8 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all text-base flex items-center justify-center gap-2 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Start Free - No Credit Card required"
              >
                Start Free — No Credit Card
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                className="h-14 px-8 border-2 border-slate-200 hover:border-primary text-slate-700 hover:text-primary rounded-xl font-semibold transition-all text-base flex items-center justify-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                aria-label="Watch 2-minute demo video"
              >
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                  <Play size={14} className="fill-current ml-0.5" />
                </div>
                Watch 2-min Demo
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-6 pt-6 border-t border-slate-200/60">
              {[
                { icon: Shield, text: "HIPAA Compliant" },
                { icon: Lock, text: "End-to-End Encrypted" },
                { icon: Star, text: "Clinically Validated" },
                { icon: Globe, text: "GDPR Ready" }
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <badge.icon size={14} className="text-teal-600" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* RIGHT COLUMN - VISUAL */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: mounted ? 1 : 0, x: mounted ? 0 : 30 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="w-full relative"
          >
            {/* Waveform Visualization Card */}
            <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 p-8 border border-slate-100 relative z-10">
              
              {/* Top Row */}
              <div className="flex justify-between items-center mb-6">
                <div className="bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-2 border border-teal-100">
                  <div className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Live Analysis
                </div>
                <span className="font-mono text-slate-400 text-sm font-medium">0:32</span>
              </div>

              {/* Waveform Canvas Placeholder */}
              <div 
                className="w-full h-32 bg-slate-50 rounded-2xl flex items-end justify-center gap-1 p-4 mb-6 border border-slate-100 overflow-hidden"
                role="img"
                aria-label="Live speech waveform visualization"
              >
                {[...Array(40)].map((_, i) => {
                  // Generate a pseudo-random height between 20% and 90%
                  const heightPercentage = 20 + Math.random() * 70;
                  const animationDelay = `${(i % 10) * 0.1}s`;
                  return (
                    <div 
                      key={i}
                      className="w-1 bg-gradient-to-t from-primary to-accent rounded-sm"
                      style={{ 
                        height: `${heightPercentage}%`,
                        animation: `scaleY 1s ease-in-out infinite alternate`,
                        animationDelay,
                        transformOrigin: 'bottom'
                      }}
                    />
                  );
                })}
              </div>

              <style dangerouslySetInnerHTML={{__html: `
                @keyframes scaleY {
                  0% { transform: scaleY(0.4); }
                  100% { transform: scaleY(1); }
                }
              `}} />

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                  { value: "112", label: "Speech Rate", unit: "WPM" },
                  { value: "4", label: "Repetitions", unit: "" },
                  { value: "92", label: "Fluency Score", unit: "%" }
                ].map((metric, i) => (
                  <div key={i} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <div className="text-xl font-bold text-slate-900 leading-tight">
                      {metric.value}<span className="text-sm ml-0.5">{metric.unit}</span>
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 uppercase tracking-wide">
                      {metric.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Insight Card */}
              <div className="bg-gradient-to-r from-primary/5 to-teal-50/50 rounded-xl p-4 flex items-start gap-3 border border-primary/10">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-primary" />
                </div>
                <div className="flex-1 w-full">
                  <h4 className="text-xs font-semibold text-primary mb-2 uppercase tracking-wide">AI Insight</h4>
                  <div className="space-y-2 w-full">
                    <div className="h-2 bg-primary/20 rounded animate-pulse w-full" />
                    <div className="h-2 bg-primary/20 rounded animate-pulse w-5/6" />
                    <div className="h-2 bg-primary/20 rounded animate-pulse w-4/6" />
                  </div>
                </div>
              </div>

            </div>
            
            {/* Decorative background blur elements */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-accent-light/20 rounded-full mix-blend-multiply filter blur-[64px] animate-blob pointer-events-none" />
            <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-secondary-light/20 rounded-full mix-blend-multiply filter blur-[64px] animate-blob animation-delay-2000 pointer-events-none" />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
