"use client";

import { useSearchParams } from "next/navigation";

export function LoginResetSuccessBanner() {
  const searchParams = useSearchParams();
  const resetSuccess = searchParams.get("reset") === "success";

  if (!resetSuccess) {
    return null;
  }

  return (
    <div
      role="status"
      className="w-full max-w-md rounded-lg border border-green-500/50 bg-green-500/10 px-4 py-3 text-sm text-green-900 dark:text-green-100"
    >
      <p className="font-medium">Password updated</p>
      <p className="mt-1 text-muted-foreground">Sign in with your new password.</p>
    </div>
  );
}
