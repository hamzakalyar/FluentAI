import React, { useState, useEffect, useCallback } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: "Sarah K.",
    role: "University Student",
    location: "New York, USA",
    rating: 5,
    initials: "SK",
    color: "bg-blue-500",
    quote: "FluentAI has genuinely changed my confidence in presentations. After 3 months of daily practice with the AI exercises, my repetition rate dropped by 60%. The analysis is eye-opening."
  },
  {
    id: 2,
    name: "Dr. James T.",
    role: "Speech-Language Pathologist",
    location: "London, UK",
    rating: 5,
    initials: "JT",
    color: "bg-teal-500",
    quote: "I recommend FluentAI to my patients as a supplement to therapy. The disfluency detection is remarkably accurate, and the personalized exercises save hours of manual exercise planning."
  },
  {
    id: 3,
    name: "Ahmed R.",
    role: "Software Engineer",
    location: "Dubai, UAE",
    rating: 5,
    initials: "AR",
    color: "bg-purple-500", // using purple instead of violet
    quote: "The non-judgmental interface made it easy for me to practice daily. Seeing my fluency score improve week by week on the dashboard was the motivation I needed to keep going."
  },
  {
    id: 4,
    name: "Maria L.",
    role: "Public Speaker",
    location: "Barcelona, Spain",
    rating: 5,
    initials: "ML",
    color: "bg-rose-500",
    quote: "As someone who presents at conferences, reducing filler words and repetitions was critical. FluentAI's AI insights helped me identify patterns I had never noticed before."
  }
];

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // On desktop we show 3 items, on mobile we show 1. 
  // For simplicity without window resize listener, we use a CSS-based approach for layout
  // but logically manage the index for dots.
  
  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isHovered, nextSlide]);

  return (
    <section id="testimonials" className="bg-slate-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <div className="text-xs font-semibold text-teal-600 uppercase tracking-widest mb-4">
            REAL RESULTS
          </div>
          <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by People Who Stutter<br className="hidden sm:block" /> and Speech Professionals
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto mt-4 leading-relaxed">
            Join thousands who have improved their fluency with AI-powered practice and analysis.
          </p>
        </div>

        {/* Carousel */}
        <div 
          className="relative reveal"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* We'll use CSS grid/flex to show the items. To make it a true carousel we'll use overflow-hidden and transform. */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((t) => (
                <div key={t.id} className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4">
                  <div className="bg-white border border-slate-100 rounded-2xl p-7 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="text-5xl text-primary/20 font-serif leading-none mb-2">"</div>
                    
                    <div className="flex gap-0.5 mb-4">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    
                    <p className="text-slate-700 text-[15px] leading-relaxed italic mb-5 flex-1">
                      {t.quote}
                    </p>
                    
                    <div className="flex items-center gap-3 mt-auto pt-4 border-t border-slate-50">
                      <div className={`w-11 h-11 rounded-full ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                        {t.initials}
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-slate-900">{t.name}</h4>
                        <p className="text-xs text-slate-500">{t.role} • {t.location}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button 
              onClick={prevSlide}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center text-slate-500"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="flex items-center justify-center gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    currentIndex === i ? 'w-6 bg-primary' : 'w-2 bg-slate-200'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <button 
              onClick={nextSlide}
              className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm hover:border-primary hover:text-primary transition-all flex items-center justify-center text-slate-500"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Logos Row */}
        <div className="mt-20 border-t border-slate-200/60 pt-16 reveal">
          <p className="text-sm text-slate-400 text-center mb-8 font-medium">Trusted by teams at:</p>
          <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-28 h-8 bg-slate-200 rounded animate-pulse" />
            ))}
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default TestimonialsSection;
