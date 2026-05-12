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
  variant = 'dark',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  const variants = {
    dark: 'bg-[#0A0F1E] border-[#1E2A40] text-[#F0F4FF] focus:border-[#00C896]',
    light: 'bg-white border-[#E2E8F0] text-[#0A0F1E] focus:border-[#00C896]',
  };

  return (
    <div className="w-full space-y-2">
      {label && (
        <label 
          htmlFor={id} 
          className={cn(
            "block text-[10px] font-bold uppercase tracking-[0.15em] ml-1 font-body",
            variant === 'dark' ? "text-[#8B9BB8]" : "text-[#5F6B82]"
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
            'w-full h-11 px-4 border rounded-lg outline-none transition-all duration-200 font-body text-sm',
            'placeholder:text-[#3D4F6B]',
            variants[variant],
            error && 'border-[#FF6B6B] focus:border-[#FF6B6B]',
            className
          )}
          {...props}
        />
        
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-[#3D4F6B] hover:text-[#8B9BB8] transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {(error || helperText) && (
        <p className={cn(
          "text-[11px] font-bold ml-1 font-body",
          error ? "text-[#FF6B6B]" : "text-[#8B9BB8]"
        )}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
