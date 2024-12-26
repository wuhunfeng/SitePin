'use client';

import { useUptimeRobot, UptimeMonitor } from './useUptimeRobot';

export function useMonitors() {
  const { 
    data, 
    isLoading: loading, 
    error 
  } = useUptimeRobot<{ monitors: UptimeMonitor[] }>('getMonitors');

  return { 
    monitors: data?.monitors || [], 
    loading, 
    error 
  };
} 