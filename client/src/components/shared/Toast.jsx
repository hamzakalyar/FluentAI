import React from 'react';
import { Toaster as Sonner } from 'sonner';

const Toast = () => {
  return (
    <Sonner
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '1rem',
          padding: '1rem',
          fontSize: '0.875rem',
          fontWeight: '600',
        },
        className: 'font-sans',
      }}
      richColors
      closeButton
    />
  );
};

export default Toast;
