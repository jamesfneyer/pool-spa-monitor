import { Suspense } from "react";
import { SetupWizard } from "@/components/setup/setup-wizard";
import { LoadingState } from "@/components/shared/loading-state";

export default function SetupPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <SetupWizard />
    </Suspense>
  );
}
