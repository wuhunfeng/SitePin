'use client'

import { useState } from 'react';
import Masonry from 'react-masonry-css';
import { Site } from '@/types/site';
import { StoredMonitor } from '@/lib/db';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import MonitorDetailsDialog from '../MonitorDetailsDialog';
import MonitorStatusDialog from '../MonitorStatusDialog';

interface Props {
  sites: Site[];
  monitors: StoredMonitor[];
}

export default function MasonryLayout({ sites, monitors }: Props) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const breakpointColumns = {
    default: 4,
    1536: 4,
    1280: 3,
    1024: 3,
    768: 2,
    640: 1
  };

  return (
    <>
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex -ml-8 w-auto"
        columnClassName="pl-8 bg-clip-padding"
      >
        {sites.map((site) => {
          const monitor = monitors.find(m => 
            new URL(m.url).hostname === new URL(site.url).hostname
          );
          
          return (
            <div key={site._id} className="mb-8">
              <div className="fluent-card group relative">
                {/* 响应时间胶囊 - 固定在右上角 */}
                {monitor && (
                  <div className="absolute top-4 right-4 z-10">
                    <div 
                      className="flex items-center gap-2 px-3 py-1.5 opacity-80 
                      bg-white/80 backdrop-blur-sm rounded-full
                      border border-gray-200/50 shadow-sm
                      hover:bg-white/90 transition-colors cursor-pointer
                      text-xs text-gray-600 hover:text-gray-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSite(site);
                        setShowStatusDialog(true);
                      }}
                    >
                      <div className={`w-2 h-2 rounded-full ${
                        monitor?.status === 2 ? 'bg-emerald-400' :
                        monitor?.status === 9 ? 'bg-amber-400' :
                        'bg-rose-400'
                      }`} />
                      <span>{monitor.average_response_time ? `${monitor.average_response_time}ms` : 'N/A'}</span>
                    </div>
                  </div>
                )}

                {/* 点击图片打开详情 */}
                {site.screenshot && (
                  <div 
                    className="relative cursor-pointer"
                    onClick={() => setSelectedSite(site)}
                  >
                    <Image
                      src={site.screenshot}
                      alt={site.name}
                      width={800}
                      height={600}
                    //   loading="lazy"
                      placeholder="blur"
                      blurDataURL={site.screenshot}
                      className="w-full h-auto"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="font-medium">{site.name}</h3>
                    <a
                      href={site.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md hover:bg-black/5 
                      transition-all duration-200 group"
                    >
                      <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-gray-400 
                        group-hover:text-gray-600 group-hover:-translate-y-0.5 
                        group-hover:translate-x-0.5 transition-all" />
                    </a>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">
                    {site.description}
                  </p>
                  
                  {site.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {site.tags.map(tag => (
                        <span 
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-gray-100/80 
                          text-gray-600 rounded-full hover:bg-gray-200/80 
                          transition-colors cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </Masonry>

      {/* 对话框 */}
      {selectedSite && (
        <>
          <MonitorDetailsDialog
            isOpen={selectedSite && !showStatusDialog}
            onClose={() => setSelectedSite(null)}
            site={selectedSite}
          />
          {/* 只在有 monitor 数据时显示状态对话框 */}
          {monitors.find(m => 
            new URL(m.url).hostname === new URL(selectedSite.url).hostname
          ) && (
            <MonitorStatusDialog
              isOpen={showStatusDialog}
              onClose={() => {
                setShowStatusDialog(false);
                setSelectedSite(null);
              }}
              monitor={monitors.find(m => 
                new URL(m.url).hostname === new URL(selectedSite.url).hostname
              )!}
            />
          )}
        </>
      )}
    </>
  );
} 