import { useState } from 'react';
import { Site } from '@/types/site';
import { SITE_TYPES } from '@/constants/site';
import { motion } from 'framer-motion';

interface Props {
  sites: Site[];
  onSitesFiltered: (sites: Site[]) => void;
}

export default function FilteredSites({ sites, onSitesFiltered }: Props) {
  const [activeType, setActiveType] = useState(SITE_TYPES[0].value);

  const handleTypeChange = (type: string) => {
    setActiveType(type);
    onSitesFiltered(sites.filter(site => site.type === type));
  };

  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide mb-8">
      {SITE_TYPES.map(type => {
        const typeSites = sites.filter(site => site.type === type.value);
        if (typeSites.length === 0) return null;
        
        return (
          <motion.button
            key={type.value}
            onClick={() => handleTypeChange(type.value)}
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
  );
}