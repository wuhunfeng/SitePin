'use client';

import { useState, useEffect } from 'react';

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
  sub_type: string;
  keyword_type: string;
  keyword_case_type: string;
  keyword_value: string;
  http_username: string;
  http_password: string;
  port: string;
  interval: number;
  status: number;
  create_datetime: number;
  monitor_group: number;
  is_group_main: number;
  logs: {
    type: number;
    datetime: number;
    duration: number;
  }[];
}

export function useUptimeRobot<T>(endpoint: UptimeEndpoint) {
  const [data, setData] = useState<UptimeResponse<T> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/uptimerobot/${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [endpoint]);

  return { data, error, loading };
}

