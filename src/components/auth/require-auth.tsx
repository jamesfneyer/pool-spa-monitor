"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { env } from "@/lib/config/env";

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading || env.devAuthBypass) {
      return;
    }

    if (!isAuthenticated) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [isAuthenticated, isLoading, pathname, router]);

  if (isLoading && !env.devAuthBypass) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-sm text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated && !env.devAuthBypass) {
    return null;
  }

  return <>{children}</>;
}
