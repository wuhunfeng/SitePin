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

export default function MonitorCard({ monitor }: { monitor: StoredMonitor }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 300); // 匹配动画持续时间
  };

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
          onClick={() => setIsOpen(true)}
          className="absolute right-0 bottom-0 cursor-pointer group w-10 h-10"
        >
          <div className={`absolute -inset-4 ${getStatusColor(monitor.status)} 
            opacity-5 blur-2xl rounded-tl-full animate-pulse`} />
          <div className={`absolute -inset-2 ${getStatusColor(monitor.status)} 
            opacity-20 blur-xl rounded-tl-full 
            group-hover:opacity-90 transition-all duration-1000`} />
        </button>
      </div>

      {isOpen && (
        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-lg flex items-center justify-center z-50
          ${isClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'}`}
          onClick={closeModal}
        >
          <div 
            className={`bg-white/80 backdrop-blur-xl border border-white/20 rounded-xl 
            p-8 max-w-lg w-full mx-4 shadow-xl 
            ${isClosing ? 
              'animate-out fade-out zoom-out-95 slide-out-to-bottom-4 duration-300' : 
              'animate-in fade-in zoom-in-95 slide-in-from-bottom-4 duration-300'}`}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium flex items-center gap-2">
                {monitor.friendly_name}
              </h2>
              <button 
                onClick={closeModal}
                className="p-1.5 hover:bg-zinc-100 rounded-full transition-colors
                hover:rotate-90 transition-all duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <p className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-zinc-400" />
                <a href={monitor.url} target="_blank" rel="noopener noreferrer" 
                  className="text-blue-500 hover:underline">
                  {monitor.url}
                </a>
              </p>
              <p className="flex items-center gap-2">
                {getStatusIcon(monitor.status)}
                <span className={getStatusColor(monitor.status)}>
                  {getStatusText(monitor.status)}
                </span>
              </p>
              {monitor.average_response_time && (
                <p className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4 text-zinc-400" />
                  {monitor.average_response_time}ms
                </p>
              )}
              <p className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-zinc-400" />
                {new Date(monitor.create_datetime * 1000).toLocaleString()}
              </p>
              <p className="flex items-center gap-2">
                <ClockIcon className="w-4 h-4 text-zinc-400" />
                {new Date(monitor.lastUpdated).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 