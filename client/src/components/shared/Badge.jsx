import React from 'react';
import { cn } from '../../utils/cn';

const Badge = ({
  children,
  variant = 'info',
  size = 'md',
  className = '',
  icon: Icon
}) => {
  const variants = {
    info:    'bg-indigo-700 text-white border-transparent dark:bg-indigo-600',
    success: 'bg-teal-700 text-white border-transparent dark:bg-teal-600',
    warning: 'bg-amber-700 text-white border-transparent dark:bg-amber-600',
    error:   'bg-red-700 text-white border-transparent dark:bg-red-600',
    slate:   'bg-slate-800 text-white border-transparent dark:bg-slate-700',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-[11px] font-black uppercase tracking-tight',
    md: 'px-2.5 py-1 text-xs font-black uppercase tracking-tight',
    lg: 'px-3 py-1.5 text-sm font-black uppercase tracking-tight',
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1.5 rounded-full border',
      variants[variant],
      sizes[size],
      className
    )}>
      {Icon && <Icon size={size === 'sm' ? 10 : 12} />}
      {children}
    </span>
  );
};

export default Badge;
