'use client'

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { RecommendedDialog } from './RecommendedDialog';
import { useSites } from '@/hooks/useSites';
import { Site } from '@/types/site';

export default function RecommendedSites() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { sites } = useSites();
  const [randomSite, setRandomSite] = useState<Site | null>(null);
  const [hasViewed, setHasViewed] = useState(false);

  // 随机选择一个站点
  const getRandomSite = () => {
    if (sites.length === 0) return;
    const randomIndex = Math.floor(Math.random() * sites.length);
    setRandomSite(sites[randomIndex]);
  };

  // 初始化时随机选择一个站点
  useEffect(() => {
    if (sites.length > 0) {
      getRandomSite();
    }
  }, [sites]);

  return (
    <>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        onClick={() => {
            setIsDialogOpen(true);
            setHasViewed(true);
        }}
        className="fixed top-20 sm:top-24 right-4 sm:right-8 z-50 group scale-90 sm:scale-100"
      >
        <motion.div 
          className="relative bg-gray-50/70 backdrop-blur-xl rounded-xl shadow-lg 
            p-3 sm:p-4 flex items-center gap-3 hover:bg-gray-100/80 transition-colors
            border border-gray-200/30"
          whileHover={{ scale: 1.02 }}
        >
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gray-100/80 
            flex items-center justify-center flex-shrink-0 border border-gray-200/50
            hidden sm:flex">
            <motion.span 
              className="text-gray-700 text-base sm:text-lg font-medium"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              AI
            </motion.span>
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <h3 className="font-medium text-gray-900 text-sm sm:text-base">AI 智能推荐</h3>
            <p className="text-xs sm:text-sm text-gray-500 truncate">
              {randomSite?.name || '发现新网站'}
            </p>
          </div>
          
          {/* 引导提示 */}
          {!hasViewed && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-12 left-0 right-0 mx-auto whitespace-nowrap
                bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg w-fit
                opacity-0 group-hover:opacity-100 transition-opacity"
            >
              点击查看推荐
              <div className="absolute left-1/2 -translate-x-1/2 -top-1 rotate-45
                w-2 h-2 bg-gray-900" />
            </motion.div>
          )}
        </motion.div>
      </motion.button>

      <RecommendedDialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        site={randomSite}
        onSiteChange={setRandomSite}
      />
    </>
  );
} 