import React, { useState } from 'react';

export function Dialog({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50
      ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
      onClick={handleClose}
    >
      <div 
        className={`bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl 
        p-8 max-w-lg w-full mx-4 shadow-xl 
        ${isClosing ? 
          'animate-out fade-out zoom-out-95 slide-out-to-bottom-4 duration-300' : 
          'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300'}`}
        onClick={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
} 