'use client'

import { useState } from 'react';
import { StoredMonitor } from '@/lib/db';
import { Site } from '@/types/site';
import { 
  ArrowTopRightOnSquareIcon, 
  PhotoIcon,
} from '@heroicons/react/24/outline';
import MonitorStatusDialog from './MonitorStatusDialog';
import MonitorDetailsDialog from './MonitorDetailsDialog';
import Image from 'next/image';

interface Props {
  monitor?: StoredMonitor;
  site: Site;
}

export function MonitorCardSkeleton() {
  return (
    <div className="fluent-card rounded-xl p-6 aspect-square">
      <div className="space-y-4">
        <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse" />
        <div className="relative aspect-[4/3] rounded-xl bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}

export default function MonitorCard({ monitor, site }: Props) {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);

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
      <div 
        className="fluent-card backdrop-blur-sm rounded-xl p-6 
        aspect-square flex flex-col justify-between relative overflow-hidden
        cursor-pointer hover:shadow-lg hover:shadow-indigo-500/10
        border border-white/40 bg-gradient-to-br from-white/80 to-white/60"
        onClick={() => setIsDetailsOpen(true)}
      >
        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsStatusOpen(true);
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
          <a href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 
            font-semibold text-gray-900/90 text-lg
            hover:text-gray-900 transition-colors truncate
            drop-shadow-sm"
          >
            <span className="truncate">{site.name}</span>
            <ArrowTopRightOnSquareIcon className="w-4 h-4 opacity-0 shrink-0
            group-hover:opacity-100 transition-opacity" />
          </a>
          
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

      {monitor && (
        <MonitorStatusDialog 
          isOpen={isStatusOpen}
          onClose={() => setIsStatusOpen(false)}
          monitor={monitor}
        />
      )}


      <MonitorDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        site={site}
      />
    </>
  );
} 