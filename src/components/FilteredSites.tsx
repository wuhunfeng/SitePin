import { useState } from 'react';
import { Site } from '@/types/site';
import { StoredMonitor } from '@/lib/db';
import { SITE_TYPES } from '@/constants/site';
import { motion } from 'framer-motion';
import GridLayout from './layouts/GridLayout';
import ListLayout from './layouts/ListLayout';
import MasonryLayout from './layouts/MasonryLayout';
import LayoutSwitcher from './LayoutSwitcher';

interface Props {
  sites: Site[];
  monitors: StoredMonitor[];
  layout: 'grid' | 'list' | 'masonry';
  setLayout: (layout: 'grid' | 'list' | 'masonry') => void;
}

export default function FilteredSites({ sites, monitors, layout, setLayout }: Props) {
  const [activeType, setActiveType] = useState(SITE_TYPES[0].value);

  const filteredSites = sites.filter(site => site.type === activeType);

  return (
    <>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        {/* 类型筛选 - 极简设计 */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {SITE_TYPES.map(type => {
            const typeSites = sites.filter(site => site.type === type.value);
            if (typeSites.length === 0) return null;
            
            return (
              <motion.button
                key={type.value}
                onClick={() => setActiveType(type.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-all relative
                  ${activeType === type.value 
                    ? 'text-gray-900 font-medium' 
                    : 'text-gray-500 hover:text-gray-700'}`}
              >
                {type.label}
                {activeType === type.value && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute inset-x-0 -bottom-2 h-0.5 bg-gray-900"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>

        <LayoutSwitcher layout={layout} onChange={setLayout} />
      </div>

      <motion.div
        key={layout + activeType}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        className="min-h-[200px]"
      >
        {layout === 'grid' && (
          <GridLayout sites={filteredSites} monitors={monitors} />
        )}
        
        {layout === 'list' && (
          <ListLayout sites={filteredSites} monitors={monitors} />
        )}
        
        {layout === 'masonry' && (
          <MasonryLayout sites={filteredSites} monitors={monitors} />
        )}
      </motion.div>
    </>
  );
}