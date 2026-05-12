import React from 'react';
import { motion } from 'framer-motion';
import { Mic2, Activity, BarChart2, BookOpen, Radio, ShieldCheck, ChevronRight } from 'lucide-react';

const features = [
  {
    id: 1,
    icon: Mic2,
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    title: 'Real-Time Speech Transcription',
    body: 'Powered by OpenAI Whisper, our system transcribes your speech with 98% accuracy across 20+ languages, even in noisy environments.',
    badgeText: 'Powered by Whisper',
    badgeStyle: 'bg-blue-50 text-blue-700'
  },
  {
    id: 2,
    icon: Activity,
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    title: 'AI Disfluency Detection',
    body: 'Automatically identifies word repetitions, prolongations, blocks, and silent pauses with clinical-level precision.',
    badgeText: 'Clinical Grade',
    badgeStyle: 'bg-slate-100 text-slate-700'
  },
  {
    id: 3,
    icon: BarChart2,
    iconBg: 'bg-purple-50', // Tailwind uses purple, violet is also available but purple is standard
    iconColor: 'text-purple-600',
    title: 'Progress Analytics Dashboard',
    body: 'Track fluency improvements over time with session-by-session analysis, trend visualization, and personalized progress reports.',
    badgeText: 'Real-Time Data',
    badgeStyle: 'bg-slate-100 text-slate-700'
  },
  {
    id: 4,
    icon: BookOpen,
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    title: 'Personalized Practice Engine',
    body: 'AI generates custom exercises targeting your specific weak phonemes and disfluency patterns. Difficulty adapts to your progress.',
    badgeText: 'AI Generated',
    badgeStyle: 'bg-amber-50 text-amber-700'
  },
  {
    id: 5,
    icon: Radio,
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-600',
    title: 'Browser-Based Recording Studio',
    body: 'Professional-grade audio capture directly in your browser. Real-time waveform visualization, pause, resume, and instant replay.',
    badgeText: 'No Download Needed',
    badgeStyle: 'bg-slate-100 text-slate-700'
  },
  {
    id: 6,
    icon: ShieldCheck,
    iconBg: 'bg-green-50',
    iconColor: 'text-green-600',
    title: 'Clinical-Grade Data Security',
    body: 'End-to-end encrypted audio storage, HIPAA-compliant data handling, and granular privacy controls — your data stays yours.',
    badgeText: 'HIPAA Compliant',
    badgeStyle: 'bg-green-50 text-green-700'
  }
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
            CORE CAPABILITIES
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Everything You Need to Monitor<br className="hidden sm:block" /> and Improve Your Speech
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            Built on clinical research and powered by the latest AI models, FluentAI provides the tools speech-language pathologists trust.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
              className="bg-white border border-slate-100 rounded-2xl p-7 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300 group cursor-default"
            >
              <div className={`w-14 h-14 rounded-2xl ${feature.iconBg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </div>
              
              <div className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full ${feature.badgeStyle} mb-4`}>
                {feature.badgeText}
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-3 leading-tight">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed text-[15px]">
                {feature.body}
              </p>
              
              <div className="mt-5 flex items-center gap-1.5 text-primary text-sm font-semibold group-hover:gap-2.5 transition-all">
                Learn more <ChevronRight className="w-4 h-4" />
              </div>
            </motion.div>
          ))}
        </div>
        
      </div>
    </section>
  );
};

export default FeaturesSection;
