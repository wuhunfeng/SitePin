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
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
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
              p-8 max-w-lg w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
} 