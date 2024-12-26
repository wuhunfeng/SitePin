'use client'

import { useState } from 'react';
import { Site } from '@/types/site';
import { StoredMonitor } from '@/lib/db';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import MonitorDetailsDialog from '../MonitorDetailsDialog';
import MonitorStatusDialog from '../MonitorStatusDialog';
import Image from 'next/image';

interface Props {
  sites: Site[];
  monitors: StoredMonitor[];
}

export default function ListLayout({ sites, monitors }: Props) {
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);

  return (
    <>
      <div className="space-y-4">
        {sites.map((site) => {
          const monitor = monitors.find(m => 
            new URL(m.url).hostname === new URL(site.url).hostname
          );
          
          return (
            <div key={site._id} 
              className="fluent-card p-4 flex items-center gap-4"
            >
              <div 
                className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
                onClick={() => setSelectedSite(site)}
              >
                {site.screenshot && (
                  <Image 
                    src={site.screenshot} 
                    alt={site.name}
                    width={128}
                    height={128}
                    // loading="lazy"
                    placeholder="blur"
                    blurDataURL={site.screenshot}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium truncate">{site.name}</h3>
                  <a
                    href={site.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-1.5 rounded-md hover:bg-black/5 
                    transition-all duration-200 group"
                  >
                    <ArrowTopRightOnSquareIcon className="w-3.5 h-3.5 text-gray-400 
                      group-hover:text-gray-600 group-hover:-translate-y-0.5 
                      group-hover:translate-x-0.5 transition-all" />
                  </a>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{site.description}</p>
              </div>

              {monitor && (
                <div 
                  className="shrink-0 cursor-pointer"
                onClick={() => {
                  setSelectedSite(site);
                  setShowStatusDialog(true);
                }}
              >
                <div className={`w-3 h-3 rounded-full ${
                  monitor?.status === 2 ? 'bg-emerald-400' :
                  monitor?.status === 9 ? 'bg-amber-400' :
                  'bg-rose-400'
                  }`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {selectedSite && (
        <>
          <MonitorDetailsDialog
            isOpen={selectedSite && !showStatusDialog}
            onClose={() => setSelectedSite(null)}
            site={selectedSite}
          />
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