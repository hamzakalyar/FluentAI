import React from 'react';
import { cn } from '../../utils/cn';

const Card = ({
  children,
  className = '',
  hoverable = false,
  interactive = false,
  padded = true,
  variant = 'default'
}) => {
  const variants = {
    default: 'bg-[var(--bg-surface)] border-[var(--border-subtle)] text-[var(--text-primary)]',
    outline: 'bg-transparent border-[var(--border-subtle)] text-[var(--text-primary)]',
    accent: 'bg-[var(--bg-surface)] border-[var(--accent-border)] text-[var(--text-primary)]',
    light: 'bg-white border-[#E2E8F0] text-[#0A0F1E]',
    glass: 'bg-[var(--bg-surface)]/80 backdrop-blur-md border-[var(--border-subtle)] text-[var(--text-primary)]',
  };

  return (
    <div className={cn(
      'rounded-2xl border shadow-sm transition-all duration-300',
      padded && 'p-6',
      variants[variant],
      hoverable && 'hover:border-[var(--accent)]/30 hover:shadow-lg hover:shadow-[var(--accent)]/5',
      interactive && 'cursor-pointer active:scale-[0.99]',
      className
    )}>
      {children}
    </div>
  );
};

export default Card;
