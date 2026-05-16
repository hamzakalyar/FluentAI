import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '../../utils/cn';

const Input = React.forwardRef(({
  label,
  error,
  helperText,
  type = 'text',
  className = '',
  id,
  variant = 'light',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const variants = {
    dark: 'bg-[#0A0F1E] border-[#1E2A40] text-[#F0F4FF] focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5',
    light: 'bg-white border-slate-200 text-slate-900 focus:border-teal-500/40 focus:ring-4 focus:ring-teal-500/5',
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className={cn(
            "block text-[11px] font-black uppercase tracking-[0.2em] ml-1 font-syne",
            variant === 'dark' ? "text-slate-400" : "text-slate-500"
          )}
        >
          {label}
        </label>
      )}
      
      <div className="relative group">
        <input
          id={id}
          ref={ref}
          type={inputType}
          className={cn(
            'w-full h-12 px-4 border rounded-xl outline-none transition-all duration-300 font-medium text-sm',
            'placeholder:text-slate-400 placeholder:font-normal',
            variants[variant],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/5',
            className
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-teal-500 transition-colors"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {(error || helperText) && (
        <p className={cn(
          "text-[11px] font-bold ml-1",
          error ? "text-red-500" : "text-slate-400"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
