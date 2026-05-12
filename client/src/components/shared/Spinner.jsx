import React from 'react';
import { cn } from '../../utils/cn';

const Spinner = ({ size = 'md', className = '', color = 'current' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        "inline-block rounded-full border-solid border-r-transparent animate-spin",
        sizeClasses[size],
        className
      )}
      style={{ borderLeftColor: color, borderTopColor: color, borderBottomColor: color }}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Spinner;
