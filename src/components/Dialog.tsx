import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasChanges?: boolean;
  title?: string | React.ReactNode;
  showCloseButton?: boolean;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  children,
  hasChanges = false,
  title,
  showCloseButton = true
}: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    }

    return () => {
      document.body.style.overflow = 'unset';
      document.body.style.touchAction = 'auto';
    };
  }, [isOpen]);

  const handleClose = () => {
    if (hasChanges && !confirm('有未保存的更改，确定要关闭吗？')) {
      return;
    }
    onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/20 backdrop-blur-lg 
            flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl 
              shadow-xl relative
              w-[90%] sm:w-[80%] max-w-lg
              max-h-[80vh] flex flex-col"
            onClick={e => e.stopPropagation()}
          >
            {(title || showCloseButton) && (
              <div className="flex-none flex justify-between items-center p-4">
                {title && (
                  <div className="text-xl font-semibold text-gray-800">
                    {title}
                  </div>
                )}
                {showCloseButton && (
                  <motion.button 
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClose}
                    className="p-1.5 hover:bg-gray-100 rounded-full ml-auto"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </motion.button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto min-h-0 p-4">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 