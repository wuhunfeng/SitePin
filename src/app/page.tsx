'use client'

import { useEffect, useState } from 'react';
import { useMonitors } from '@/hooks/useMonitors';
import MonitorCard from '@/components/MonitorCard';
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

  if (loading || monitorsLoading) return <div>Loading...</div>;

  return (
    <main className="container mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
    </main>
  );
}
