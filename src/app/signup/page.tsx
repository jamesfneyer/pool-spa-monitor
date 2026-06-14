import { Suspense } from "react";
import { Waves } from "lucide-react";
import { RedirectIfAuthenticated } from "@/components/auth/redirect-if-authenticated";
import { SandboxSetupBanner } from "@/components/auth/sandbox-setup-banner";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gradient-to-b from-background to-accent/20 p-6">
      <Suspense fallback={null}>
        <RedirectIfAuthenticated />
      </Suspense>
      <div className="flex items-center gap-2">
        <Waves className="h-7 w-7 text-primary" />
        <span className="text-lg font-semibold">Pool & Spa Command Center</span>
      </div>
      <Suspense fallback={<div className="text-sm text-muted-foreground">Loading...</div>}>
        <SandboxSetupBanner />
      </Suspense>
      <SignupForm />
    </div>
  );
}
