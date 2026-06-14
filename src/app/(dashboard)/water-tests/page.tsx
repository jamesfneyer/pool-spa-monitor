import { Suspense } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { WaterTestsPage } from "@/components/water-tests/water-tests-page";

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <WaterTestsPage />
    </Suspense>
  );
}
