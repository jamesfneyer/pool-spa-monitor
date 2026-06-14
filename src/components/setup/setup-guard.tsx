"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";

export function SetupGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const provider = useDataProvider();

  const loader = useCallback(async (p: DataProvider) => p.listPoolProfiles(), []);
  const { data: profiles, loading } = useAsyncData(loader);

  useEffect(() => {
    if (loading || profiles == null) {
      return;
    }

    if (profiles.length === 0 && pathname !== "/setup") {
      router.replace("/setup");
    }
  }, [loading, pathname, profiles, router]);

  if (loading || profiles == null) {
    return <LoadingState />;
  }

  if (profiles.length === 0) {
    return null;
  }

  return <>{children}</>;
}
