import { ViewColumnsIcon, ListBulletIcon, WindowIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';

interface Props {
  layout: 'grid' | 'list' | 'masonry';
  onChange: (layout: 'grid' | 'list' | 'masonry') => void;
}

export default function LayoutSwitcher({ layout, onChange }: Props) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 p-1.5 bg-white/20 backdrop-blur-sm 
        rounded-lg border border-white/20 shadow-sm hover:bg-white/30 
        transition-colors duration-300"
    >
      {/* 更明显的背景滑块 */}
      <motion.div
        className="absolute h-7 w-7 bg-white/80 rounded-md shadow-sm"
        layoutId="layout-background"
        transition={{ 
          type: "spring", 
          stiffness: 150, 
          damping: 20
        }}
        style={{
          left: layout === 'grid' ? '6px' : 
                layout === 'list' ? '42px' : '78px'
        }}
      />

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('grid')}
        className={`p-1.5 rounded-md z-10 transition-colors duration-200 ${
          layout === 'grid' 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <ViewColumnsIcon className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('list')}
        className={`p-1.5 rounded-md z-10 transition-colors duration-200 ${
          layout === 'list' 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <ListBulletIcon className="w-4 h-4" />
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange('masonry')}
        className={`p-1.5 rounded-md z-10 transition-colors duration-200 ${
          layout === 'masonry' 
            ? 'text-gray-900 font-medium' 
            : 'text-gray-500 hover:text-gray-700'
        }`}
      >
        <WindowIcon className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
} 