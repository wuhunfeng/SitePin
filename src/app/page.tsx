'use client'

import { useEffect, useState } from 'react';
import { useMonitors } from '@/hooks/useMonitors';
import MonitorCard, { MonitorCardSkeleton } from '@/components/MonitorCard';
import { Site } from '@/types/site';

export default function Home() {
  const { monitors, loading: monitorsLoading } = useMonitors();
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSites = async () => {
      try {
        const res = await fetch('/api/sites');
        const data = await res.json();
        setSites(data);
      } catch (error) {
        console.error('Failed to fetch sites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSites();
  }, []);

  if (loading || monitorsLoading) return (
    <main className="min-h-screen bg-gradient-to-br to-indigo-50">
      <div className="subtle-pattern">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
              <a href="https://github.com/MindMorbius/SitePin" 
                target="_blank"
                rel="noopener noreferrer" 
                className="hover:text-blue-900 transition-colors">
                SitePin
              </a>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              汇集网站，监控状态
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <MonitorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  return (
    <main className="min-h-screen bg-gradient-to-br to-indigo-50">
      <div className="subtle-pattern">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent 
              bg-gradient-to-r from-gray-900 to-gray-700 mb-4">
              <a href="https://github.com/MindMorbius/SitePin" 
                target="_blank"
                rel="noopener noreferrer" 
                className="hover:text-blue-900 transition-colors">
                SitePin
              </a>
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              汇集网站，监控状态
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sites.map((site) => (
              <MonitorCard 
                key={site._id}
                site={site}
                monitor={monitors.find(m => 
                  new URL(m.url).hostname === new URL(site.url).hostname
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
