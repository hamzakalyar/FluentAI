import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative w-full bg-gradient-to-br from-primary via-blue-700 to-teal-700 py-24 overflow-hidden">
      {/* Subtle dot pattern overlay */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Decorative Elements */}
      <div className="absolute -top-48 -right-48 w-96 h-96 rounded-full bg-white/5 pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-32 -left-32 w-64 h-64 rounded-full bg-teal-500/10 pointer-events-none" aria-hidden="true" />

      <div className="container max-w-3xl mx-auto px-6 text-center relative z-10 reveal">
        {/* Badge */}
        <div className="inline-flex items-center bg-white/10 text-white/90 text-xs font-semibold px-4 py-1.5 rounded-full border border-white/20 mb-8 backdrop-blur-sm">
          Start Your Journey Today
        </div>

        {/* Headline */}
        <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
          Ready to Speak with Confidence?
        </h2>

        {/* Subtext */}
        <p className="text-lg text-blue-100 leading-relaxed max-w-xl mx-auto mb-10">
          Join 10,000+ people improving their speech fluency with AI-powered analysis and personalized practice exercises. Start free — no credit card required.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 flex-wrap">
          <button 
            onClick={() => navigate('/register')}
            className="w-full sm:w-auto h-14 px-10 bg-white text-primary font-bold rounded-xl text-base hover:bg-blue-50 shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Start Free Trial Now
          </button>
          
          <button 
            className="w-full sm:w-auto h-14 px-10 border-2 border-white/30 text-white font-semibold rounded-xl text-base hover:bg-white/10 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
          >
            Schedule a Demo
          </button>
        </div>

        {/* Fine Print */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 text-sm text-blue-200">
          {['No credit card required', 'Cancel anytime', 'HIPAA Compliant'].map((item, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-teal-300" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CTASection;
