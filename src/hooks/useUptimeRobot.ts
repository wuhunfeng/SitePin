'use client';

import { useQuery } from '@tanstack/react-query';

type UptimeEndpoint = 'getMonitors';

interface UptimeResponse<T> {
  stat: 'ok' | 'fail';
  error?: {
    type: string;
    message: string;
  };
  pagination?: {
    offset: number;
    limit: number;
    total: number;
  };
  data?: T;
}

export interface UptimeMonitor {
  id: number;
  friendly_name: string;
  url: string;
  type: number;
  status: number;
  create_datetime: number;
  average_response_time?: number;
  lastUpdated: number;
}

async function fetchUptimeRobot<T>(endpoint: UptimeEndpoint): Promise<T> {
  const response = await fetch(`/api/uptimerobot/${endpoint}`);
  if (!response.ok) throw new Error('Network response was not ok');
  const data = await response.json();
  
  if (endpoint === 'getMonitors' && data.monitors) {
    data.monitors = data.monitors.map((monitor: any) => ({
      id: monitor.id,
      friendly_name: monitor.friendly_name,
      url: monitor.url,
      type: monitor.type,
      status: monitor.status,
      create_datetime: monitor.create_datetime,
      average_response_time: monitor.response_times?.[0]?.value,
      lastUpdated: monitor.response_times?.[0]?.datetime * 1000 || Date.now()
    }));
  }
  
  return data;
}

export function useUptimeRobot<T>(endpoint: UptimeEndpoint) {
  return useQuery({
    queryKey: ['uptimerobot', endpoint],
    queryFn: () => fetchUptimeRobot<UptimeResponse<T>>(endpoint),
    staleTime: 1000 * 60 * 5, // 5分钟后数据过期
    gcTime: 1000 * 60 * 10,   // 10分钟后清除缓存
  });
}

