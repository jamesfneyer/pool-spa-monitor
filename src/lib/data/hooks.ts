"use client";

import { useCallback, useEffect, useState } from "react";
import { getDataProvider } from "./factory";
import type { DataProvider } from "./provider";

export function useDataProvider(): DataProvider {
  return getDataProvider();
}

export function useAsyncData<T>(
  loader: (provider: DataProvider) => Promise<T>,
  deps: unknown[] = [],
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await loader(getDataProvider());
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload, ...deps]);

  return { data, loading, error, reload };
}
