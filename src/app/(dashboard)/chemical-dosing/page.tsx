import { Suspense } from "react";
import { ChemicalDosingPage } from "@/components/chemical-dosing/chemical-dosing-page";
import { LoadingState } from "@/components/shared/loading-state";

export default function Page() {
  return (
    <Suspense fallback={<LoadingState />}>
      <ChemicalDosingPage />
    </Suspense>
  );
}
