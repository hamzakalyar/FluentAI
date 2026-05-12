import React from 'react';
import { cn } from '../../utils/cn';

const Skeleton = ({
  className = '',
  variant = 'text',
  width,
  height
}) => {
  const variants = {
    text: 'h-4 w-full rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
  };

  return (
    <div
      className={cn(
        'animate-pulse bg-slate-100',
        variants[variant],
        className
      )}
      style={{ width, height }}
    />
  );
};

export default Skeleton;
