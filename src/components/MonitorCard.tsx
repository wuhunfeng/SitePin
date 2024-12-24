'use client'

import { useState, useEffect } from 'react';
import { StoredMonitor } from '@/lib/db';
import { 
  ArrowTopRightOnSquareIcon, 
  XMarkIcon,
  ClockIcon,
  GlobeAltIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  PauseCircleIcon
} from '@heroicons/react/24/outline';
import MonitorStatusDialog from './MonitorStatusDialog';
import MonitorDetailsDialog from './MonitorDetailsDialog';

export default function MonitorCard({ monitor }: { monitor: StoredMonitor }) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getStatusColor = (status: number) => {
    switch (status) {
      case 2: return 'bg-emerald-400';
      case 9: return 'bg-amber-400';
      default: return 'bg-rose-400';
    }
  };

  const getStatusText = (status: number) => {
    switch (status) {
      case 2: return 'Up';
      case 9: return 'Paused';
      default: return 'Down';
    }
  };

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 2: return <CheckCircleIcon className="w-4 h-4" />;
      case 9: return <PauseCircleIcon className="w-4 h-4" />;
      default: return <ExclamationCircleIcon className="w-4 h-4" />;
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
        <div className="space-y-4 relative">
          <a href={monitor.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-1.5 font-medium text-gray-800/90 
            hover:text-gray-900 transition-colors truncate"
          >
            <span className="truncate">{monitor.friendly_name}</span>
            <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 opacity-0 shrink-0
            group-hover:opacity-100 transition-opacity" />
          </a>
        </div>

        <button 
          onClick={(e) => {
            e.stopPropagation();
            setIsStatusOpen(true);
          }}
          className="absolute right-0 bottom-0 cursor-pointer group w-10 h-10"
        >
          <div className={`absolute -inset-4 ${getStatusColor(monitor.status)} 
            opacity-5 blur-2xl rounded-tl-full animate-pulse`} />
          <div className={`absolute -inset-2 ${getStatusColor(monitor.status)} 
            opacity-20 blur-xl rounded-tl-full 
            group-hover:opacity-90 transition-all duration-1000`} />
        </button>
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
      />
    </>
  );
} 