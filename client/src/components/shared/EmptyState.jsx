import React from 'react';
import { cn } from '../../utils/cn';
import Button from './Button';

const EmptyState = ({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center text-center p-8 md:p-12 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200",
      className
    )}>
      {Icon && (
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-6">
          <Icon className="text-slate-400" size={32} />
        </div>
      )}
      <h3 className="text-lg font-bold text-navy mb-2">{title}</h3>
      <p className="text-sm text-slate-500 max-w-xs mb-8 leading-relaxed">
        {description}
      </p>
      {actionLabel && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
