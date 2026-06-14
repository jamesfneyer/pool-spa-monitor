"use client";

import { useSearchParams } from "next/navigation";
import { isAmplifySandboxReady } from "@/lib/amplify/configure";

export function SandboxSetupBanner() {
  const searchParams = useSearchParams();
  const setupRequired = searchParams.get("setup") === "required";
  const sandboxReady = isAmplifySandboxReady();

  if (sandboxReady) {
    return null;
  }

  return (
    <div
      role="alert"
      className="w-full max-w-md rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-900 dark:text-amber-100"
    >
      <p className="font-medium">Amplify sandbox required</p>
      <p className="mt-1 text-muted-foreground">
        {setupRequired
          ? "Sign-in is not available until the Cognito User Pool is deployed."
          : "Deploy the backend before creating an account or signing in."}{" "}
        Run <code className="rounded bg-muted px-1 py-0.5">pnpm sandbox</code> in
        a separate terminal, then refresh this page.
      </p>
    </div>
  );
}
