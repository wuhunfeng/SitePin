import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  hasChanges?: boolean;
}

export function Dialog({ 
  isOpen, 
  onClose, 
  children,
  hasChanges = false
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
          className="fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50"
          onClick={handleClose}
        >
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95, 
              y: 10,
              transition: {
                duration: 0.15,
                ease: [0.32, 0.72, 0, 1]
              }
            }}
            transition={{ 
              duration: 0.2,
              ease: [0.32, 0.72, 0, 1]
            }}
            className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl 
              p-4 sm:p-8 w-[90vw] sm:w-[80vw] max-w-lg mx-4 shadow-xl overscroll-none touch-none
              max-h-[80vh] sm:max-h-[80vh] relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="overflow-y-auto max-h-[calc(80vh-2rem)] sm:max-h-[calc(80vh-4rem)]">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 