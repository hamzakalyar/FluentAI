import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, MicOff, Search } from 'lucide-react';
import Button from '../components/shared/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6">
      <div className="relative mb-12">
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ repeat: Infinity, duration: 4 }}
          className="w-48 h-48 bg-indigo-50 rounded-full flex items-center justify-center text-primary"
        >
          <MicOff size={80} />
        </motion.div>
        
        <motion.div 
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute -top-4 -right-4 w-16 h-16 bg-white rounded-2xl shadow-xl flex items-center justify-center text-amber-500 font-black text-2xl border border-slate-100"
        >
          404
        </motion.div>
      </div>

      <h1 className="text-4xl font-black text-navy mb-4 tracking-tight">Speechless?</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-10 leading-relaxed font-medium">
        The page you are looking for doesn't exist or has been moved to a quieter place. Let's get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button onClick={() => navigate('/dashboard')}>
          <Home size={18} className="mr-2" />
          Back to Dashboard
        </Button>
        <Button variant="ghost" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </div>

      <div className="mt-20 flex items-center gap-2 text-slate-300">
        <Search size={16} />
        <span className="text-xs font-bold uppercase tracking-[0.2em]">Searching for words...</span>
      </div>
    </div>
  );
};

export default NotFound;
