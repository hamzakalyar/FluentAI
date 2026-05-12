import React, { useRef, useState } from 'react';
import { cn } from '../../utils/cn';

const OTPInput = ({ length = 6, onComplete, className }) => {
  const [code, setCode] = useState(Array(length).fill(''));
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newCode = [...code];
    newCode[index] = value.substring(value.length - 1);
    setCode(newCode);

    if (value && index < length - 1) {
      inputs.current[index + 1].focus();
    }

    if (newCode.join('').length === length) {
      onComplete?.(newCode.join(''));
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  return (
    <div className={cn("flex justify-between gap-2", className)}>
      {code.map((data, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          ref={el => inputs.current[index] = el}
          value={data}
          onChange={e => handleChange(e, index)}
          onKeyDown={e => handleKeyDown(e, index)}
          className="w-12 h-14 text-center text-xl font-bold bg-slate-50 border border-slate-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-slate-300"
        />
      ))}
    </div>
  );
};

export default OTPInput;
