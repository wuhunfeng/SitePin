'use client'

import { useMonitors } from '@/hooks/useMonitors';
import MonitorCard from '@/components/MonitorCard';

export default function Home() {
  const { monitors, loading, error } = useMonitors();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <main className="container mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {monitors.map((monitor) => (
          <MonitorCard key={monitor.id} monitor={monitor} />
        ))}
      </div>
    </main>
  );
}
