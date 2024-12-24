'use client';

import { useState, useEffect } from 'react';
import { useUptimeRobot, UptimeMonitor } from './useUptimeRobot';
import { db, StoredMonitor } from '@/lib/db';

function transformMonitor(monitor: UptimeMonitor): StoredMonitor {
  return {
    id: monitor.id,
    friendly_name: monitor.friendly_name,
    url: monitor.url,
    type: monitor.type,
    status: monitor.status,
    create_datetime: monitor.create_datetime,
    average_response_time: monitor.response_times?.[0]?.value,
    lastUpdated: Date.now()
  };
}

export function useMonitors() {
  const [localMonitors, setLocalMonitors] = useState<StoredMonitor[]>([]);
  const { data, loading, error } = useUptimeRobot<{ monitors: UptimeMonitor[] }>('getMonitors');

  // 从 IndexedDB 加载数据
  useEffect(() => {
    const loadFromDB = async () => {
      const monitors = await db.getMonitors();
      if (monitors.length > 0) {
        setLocalMonitors(monitors);
      }
    };
    loadFromDB();
  }, []);

  // API 数据更新时同步到 IndexedDB
  useEffect(() => {
    if (data?.monitors) {
      const transformedMonitors = data.monitors.map(transformMonitor);
      db.updateMonitors(transformedMonitors).then(() => {
        setLocalMonitors(transformedMonitors);
      });
    }
  }, [data]);

  return { monitors: localMonitors, loading, error };
} 