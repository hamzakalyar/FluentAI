import React from 'react';
import { motion } from 'framer-motion';

const PasswordStrengthMeter = ({ password = '' }) => {
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const strength = getStrength(password);
  
  const levels = [
    { label: 'Weak', color: 'bg-red-400', text: 'text-red-500' },
    { label: 'Fair', color: 'bg-amber-400', text: 'text-amber-500' },
    { label: 'Strong', color: 'bg-teal-400', text: 'text-teal-500' },
    { label: 'Very Strong', color: 'bg-teal-600', text: 'text-teal-600' },
  ];

  const currentLevel = levels[Math.max(0, strength - 1)];

  return (
    <div className="mt-3">
      <div className="flex gap-1.5 h-1.5">
        {[1, 2, 3, 4].map((step) => (
          <div
            key={step}
            className={`flex-1 rounded-full transition-all duration-300 ${
              step <= strength ? currentLevel.color : 'bg-slate-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-[10px] font-bold uppercase tracking-wider mt-1.5 ${currentLevel.text}`}>
        Password strength: {currentLevel.label}
      </p>
    </div>
  );
};

export default PasswordStrengthMeter;
