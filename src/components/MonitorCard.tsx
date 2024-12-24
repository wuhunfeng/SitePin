'use client'

import { useState } from 'react';
import { StoredMonitor } from '@/lib/db';
import { Site } from '@/types/site';
import { 
  ArrowTopRightOnSquareIcon, 
} from '@heroicons/react/24/outline';
import MonitorStatusDialog from './MonitorStatusDialog';
import MonitorDetailsDialog from './MonitorDetailsDialog';
import Image from 'next/image';

interface Props {
  monitor?: StoredMonitor;
  site: Site;
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
        className="bg-white/30 backdrop-blur-xl border border-white/20 rounded-xl p-6 
        aspect-square flex flex-col justify-between relative overflow-hidden
        shadow-[0_0_15px_rgba(0,0,0,0.05)] hover:shadow-[0_0_20px_rgba(0,0,0,0.1)]
        hover:bg-white/40 transition-all duration-300 ease-out
        before:content-[''] before:absolute before:inset-0 
        before:bg-gradient-to-b before:from-white/5 before:to-transparent before:rounded-xl"
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
            className="group flex items-center gap-1.5 font-medium text-gray-800/90 
            hover:text-gray-900 transition-colors truncate"
          >
            <span className="truncate">{site.name}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 shrink-0
            group-hover:opacity-100 transition-opacity" />
          </a>
          
          <div className="relative overflow-hidden rounded-xl group aspect-[4/3] bg-gray-50/50
            shadow-[inset_0_0_1px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.05)]
            hover:shadow-[inset_0_0_1px_rgba(0,0,0,0.15),0_4px_8px_rgba(0,0,0,0.1)]
            transition-shadow duration-300">
            <div className="absolute inset-0 shadow-[inset_0_1px_2px_rgba(255,255,255,0.5)]" />
            <Image 
              src={site.screenshot} 
              alt={site.name} 
              fill
              className="object-cover transition-transform duration-500
              group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>



        </div>

      </div>

      <MonitorStatusDialog 
        isOpen={isStatusOpen}
        onClose={() => setIsStatusOpen(false)}
        monitor={monitor}
      />

      <MonitorDetailsDialog
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        monitor={monitor}
        site={site}
      />
    </>
  );
} 