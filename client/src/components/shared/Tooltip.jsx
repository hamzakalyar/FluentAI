import React, { useState } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { cn } from '../../utils/cn';

const Tooltip = ({
  children,
  content,
  position = 'top',
  delay = 200,
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  let timeout;

  const handleMouseEnter = () => {
    timeout = setTimeout(() => setIsOpen(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeout);
    setIsOpen(false);
  };

  const positions = {
    top: '-translate-x-1/2 left-1/2 bottom-full mb-2',
    bottom: '-translate-x-1/2 left-1/2 top-full mt-2',
    left: '-translate-y-1/2 top-1/2 right-full mr-2',
    right: '-translate-y-1/2 top-1/2 left-full ml-2',
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <Transition
        show={isOpen}
        as={React.Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 scale-100"
        leaveTo="opacity-0 scale-95"
      >
        <div className={cn(
          "absolute z-[100] px-3 py-1.5 text-xs font-semibold text-white bg-navy rounded-lg shadow-lg whitespace-nowrap pointer-events-none",
          positions[position],
          className
        )}>
          {content}
          <div className={cn(
            "absolute w-2 h-2 bg-navy rotate-45",
            position === 'top' && "left-1/2 -translate-x-1/2 top-full -mt-1",
            position === 'bottom' && "left-1/2 -translate-x-1/2 bottom-full -mb-1",
            position === 'left' && "top-1/2 -translate-y-1/2 left-full -ml-1",
            position === 'right' && "top-1/2 -translate-y-1/2 right-full -mr-1",
          )} />
        </div>
      </Transition>
    </div>
  );
};

export default Tooltip;
