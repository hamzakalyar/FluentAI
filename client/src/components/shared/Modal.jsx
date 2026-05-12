import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

const Modal = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  maxWidth = 'sm',
  showClose = true
}) => {
  const maxWidths = {
    xs: 'max-w-xs',
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-navy/40 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className={cn(
                "relative transform overflow-hidden rounded-2xl bg-white text-left shadow-2xl transition-all w-full sm:my-8",
                maxWidths[maxWidth]
              )}>
                <div className="bg-white px-6 py-6 sm:p-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      {title && (
                        <Dialog.Title as="h3" className="text-xl font-bold text-navy leading-6">
                          {title}
                        </Dialog.Title>
                      )}
                      {subtitle && (
                        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
                      )}
                    </div>
                    {showClose && (
                      <button
                        type="button"
                        className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all focus:outline-none"
                        onClick={onClose}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                  
                  <div className="mt-2">
                    {children}
                  </div>
                </div>

                {footer && (
                  <div className="bg-slate-50 px-6 py-4 flex flex-row-reverse gap-3">
                    {footer}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
