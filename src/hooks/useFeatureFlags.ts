import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export type FeatureFlag = {
  id: number; code: string; label: string; description: string;
  sortOrder: number; isActive: boolean; parentCode?: string;
};

// Cached in module scope — fetched once per session
let cache: Record<string, boolean> | null = null;
let fetchPromise: Promise<Record<string, boolean>> | null = null;

async function fetchFlags(): Promise<Record<string, boolean>> {
  if (cache) return cache;
  if (fetchPromise) return fetchPromise;
  fetchPromise = api.get<FeatureFlag[]>('/api/v1/master/feature/all')
    .then(r => {
      const map: Record<string, boolean> = {};
      (r.data as any[]).forEach((f: any) => { map[f.code] = f.isActive; });
      cache = map;
      return map;
    })
    .catch(() => {
      // On error, treat all features as enabled
      cache = {};
      return {};
    });
  return fetchPromise;
}

/** Returns { enabled(code), flags, toggleFlag, loading } */
export function useFeatureFlags() {
  const [flags, setFlags] = useState<Record<string, boolean>>(cache || {});
  const [loading, setLoading] = useState(!cache);

  useEffect(() => {
    if (cache) { setFlags(cache); setLoading(false); return; }
    fetchFlags().then(f => { setFlags(f); setLoading(false); });
  }, []);

  const enabled = useCallback((code: string): boolean => {
    // Default true if not found (safe — don't hide features due to network error)
    return flags[code] !== false;
  }, [flags]);

  const toggleFlag = useCallback(async (code: string) => {
    await api.patch(`/api/v1/master/feature/${code}/toggle`);
    cache = null; fetchPromise = null; // invalidate cache
    const updated = await fetchFlags();
    setFlags({ ...updated });
  }, []);

  const setFlag = useCallback(async (code: string, enabled: boolean) => {
    await api.patch(`/api/v1/master/feature/${code}?enabled=${enabled}`);
    cache = null; fetchPromise = null;
    const updated = await fetchFlags();
    setFlags({ ...updated });
  }, []);

  return { enabled, flags, loading, toggleFlag, setFlag };
}

/** Synchronous check using cached flags — returns true if not yet loaded (safe default) */
export function isFeatureEnabled(code: string): boolean {
  return cache === null || cache[code] !== false;
}

export function invalidateFlagCache() {
  cache = null; fetchPromise = null;
}
