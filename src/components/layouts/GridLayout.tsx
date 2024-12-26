'use client'

import { useState } from 'react';
import { Site } from '@/types/site';
import { StoredMonitor } from '@/lib/db';
import { 
  ArrowTopRightOnSquareIcon, 
  PhotoIcon,
} from '@heroicons/react/24/outline';
import MonitorStatusDialog from '../MonitorStatusDialog';
import MonitorDetailsDialog from '../MonitorDetailsDialog';
import Image from 'next/image';

interface Props {
  sites: Site[];
  monitors: StoredMonitor[];
}

export default function GridLayout({ sites, monitors }: Props) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  const getStatusColor = (status?: number) => {
    switch (status) {
      case 2: return 'bg-emerald-400';
      case 9: return 'bg-amber-400';
      case undefined: return 'bg-gray-400';
      default: return 'bg-rose-400';
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sites.map((site) => {
          const monitor = monitors.find(m => 
            new URL(m.url).hostname === new URL(site.url).hostname
          );
          
          return (
            <div 
              key={site._id}
              className="fluent-card backdrop-blur-sm rounded-xl p-6 
              aspect-square flex flex-col justify-between relative overflow-hidden
              cursor-pointer hover:shadow-lg hover:shadow-black/10
              border border-white/40 bg-gradient-to-br from-white/80 to-white/60"
              onClick={() => setSelectedSite(site)}
            >
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (monitor) {
                    setSelectedSite(site);
                    setShowStatusDialog(true);
                  }
                }}
                className="absolute right-0 bottom-0 cursor-pointer group w-8 h-8"
              >
                <div className={`absolute -inset-4 ${getStatusColor(monitor?.status)} 
                  opacity-5 blur-2xl rounded-tl-full animate-pulse`} />
                <div className={`absolute -inset-2 ${getStatusColor(monitor?.status)} 
                  opacity-20 blur-xl rounded-tl-full 
                  group-hover:opacity-90 transition-all duration-1000`} />
              </button>

              <div className="space-y-4 relative">
                <div className="flex items-center gap-1.5">
                  <div className="group flex items-center gap-1.5 
                    font-semibold text-gray-900/90 text-lg truncate">
                    <span className="truncate">{site.name}</span>
                  </div>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1 rounded-md hover:bg-black/5 
                    transition-all duration-200 group"
                  >
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-gray-400 
                      group-hover:text-gray-600 group-hover:-translate-y-0.5 
                      group-hover:translate-x-0.5 transition-all" />
                  </a>
                </div>
                <div className="relative overflow-hidden rounded-xl group aspect-[4/3] 
                  bg-gradient-to-br from-gray-50/80 to-white/80
                  shadow-[inset_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]
                  hover:shadow-[inset_0_0_1px_rgba(0,0,0,0.15),0_8px_16px_rgba(0,0,0,0.1)]
                  transition-all duration-300">
                  <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />

                  {site.screenshot ? (
                    <Image 
                      src={site.screenshot} 
                      alt={site.name} 
                      fill
                      className="object-cover transition-transform duration-500
                      group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
                      <PhotoIcon className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

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