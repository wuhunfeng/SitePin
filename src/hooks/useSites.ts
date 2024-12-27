import { useState, useEffect } from 'react';
import { Site } from '@/types/site';

export function useSites() {
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchSites = async () => {
    try {
      const res = await fetch('/api/sites');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setSites(Array.isArray(data) ? data : []);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to fetch sites'));
      setSites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return { sites, loading, error, refetch: fetchSites };
} 