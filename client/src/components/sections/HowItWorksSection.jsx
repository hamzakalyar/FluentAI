import React from 'react';
import { Mic, Cpu, BarChart2, Target } from 'lucide-react';

const steps = [
  {
    num: "01",
    icon: Mic,
    color: "blue",
    colorCode: "#2563EB", // text-blue-600
    bgCode: "rgba(37,99,235,0.1)", // bg-blue-600/10
    title: "Record Your Speech",
    body: "Use any microphone. Our browser-based studio captures your speech with real-time waveform visualization."
  },
  {
    num: "02",
    icon: Cpu,
    color: "teal",
    colorCode: "#0D9488", // text-teal-600
    bgCode: "rgba(13,148,136,0.1)", // bg-teal-600/10
    title: "AI Transcription",
    body: "Whisper AI transcribes your audio with 98% accuracy and identifies every word, pause, and hesitation."
  },
  {
    num: "03",
    icon: BarChart2,
    color: "purple", // Tailwind uses purple
    colorCode: "#9333EA", // text-purple-600
    bgCode: "rgba(147,51,234,0.1)", // bg-purple-600/10
    title: "Fluency Analysis",
    body: "Our algorithms detect disfluency patterns, calculate speech rate, and score your fluency on a clinical scale."
  },
  {
    num: "04",
    icon: Target,
    color: "amber",
    colorCode: "#D97706", // text-amber-600
    bgCode: "rgba(217,119,6,0.1)", // bg-amber-600/10
    title: "Personalized Practice",
    body: "Receive AI-generated exercises targeting your specific weak sounds. Track improvement session by session."
  }
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-20 reveal">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
            THE PROCESS
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            From Recording to Insights<br className="hidden sm:block" /> in Under 60 Seconds
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            No complex setup. No technical knowledge required. Just speak, and let our AI do the rest.
          </p>
        </div>

        {/* Stepper */}
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 md:gap-4">
          {steps.map((step, index) => (
            <div key={step.num} className="flex-1 flex flex-col items-center text-center relative w-full reveal" style={{ transitionDelay: `${index * 150}ms` }}>
              
              {/* Connector Line (Desktop Only) */}
              {index !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[50%] w-full h-px border-t-2 border-dashed border-slate-300 z-0" />
              )}

              <div className="relative z-10 mb-4">
                {/* Step Number Badge */}
                <div 
                  className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-white border-2 flex items-center justify-center text-xs font-black"
                  style={{ borderColor: step.colorCode, color: step.colorCode }}
                >
                  {step.num}
                </div>
                
                {/* Icon Container */}
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: step.bgCode }}
                >
                  <step.icon className="w-8 h-8" style={{ color: step.colorCode }} />
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2">{step.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed max-w-xs">{step.body}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
