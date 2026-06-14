"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/auth/auth-provider";

export function RedirectIfAuthenticated() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (isLoading || !isAuthenticated) {
      return;
    }

    const redirect = searchParams.get("redirect") ?? "/dashboard";
    router.replace(redirect);
  }, [isAuthenticated, isLoading, router, searchParams]);

  return null;
}
