"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { ChemistryTipsPanel } from "@/components/shared/chemistry-tips-panel";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { WaterChemistrySummary } from "@/components/shared/water-chemistry-summary";
import { getTestRecommendations } from "@/lib/chemistry/test-recommendations";
import { useRecommendationMaintenance } from "@/lib/chemistry/use-recommendation-maintenance";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getChemistryStatus } from "@/lib/chemistry/status";
import { useAsyncData } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import { cn } from "@/lib/utils";

export default function WaterTestDetailPage() {
  const params = useParams();
  const id = String(params.id);

  const loader = useCallback(async (provider: DataProvider) => {
    const test = await provider.getWaterTest(id);
    if (!test) return null;
    const profile = await provider.getPoolProfile(test.poolProfileId);
    return { test, profile };
  }, [id]);

  const { data, loading, error } = useAsyncData(loader, [id]);

  const recommendationGroupId = data ? `chem-plan-test-${data.test.id}` : null;
  const poolProfileId = data?.profile?.id ?? null;
  const { addedTipIds, addingTipId, handleAddToMaintenance } =
    useRecommendationMaintenance(recommendationGroupId, poolProfileId);

  const tips = useMemo(
    () => (data?.profile ? getTestRecommendations(data.profile, data.test) : []),
    [data],
  );

  if (loading) return <LoadingState />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) {
    return <p className="text-sm text-muted-foreground">Water test not found.</p>;
  }

  const { test, profile } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Water test — ${format(new Date(test.testedAt), "PPP")}`}
        description={profile?.name}
        actions={
          <Link href="/water-tests" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to list
          </Link>
        }
      />

      {profile ? (
        <Card>
          <CardHeader>
            <CardTitle>Chemistry summary</CardTitle>
            <div className="flex gap-2">
              <StatusBadge
                status={getChemistryStatus(
                  test.freeChlorine,
                  profile.targetFreeChlorineMin,
                  profile.targetFreeChlorineMax,
                )}
              />
              <StatusBadge
                status={getChemistryStatus(test.pH, profile.targetPHMin, profile.targetPHMax)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <WaterChemistrySummary profile={profile} test={test} />
          </CardContent>
        </Card>
      ) : null}

      {profile && tips.length > 0 ? (
        <ChemistryTipsPanel
          tips={tips}
          allTips={tips}
          title="Recommended actions"
          description={`Based on ${profile.name} targets`}
          addedTipIds={addedTipIds}
          addingTipId={addingTipId}
          onAddToMaintenance={(tip) => handleAddToMaintenance(tip, tips)}
        />
      ) : null}

      {test.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{test.notes}</CardContent>
        </Card>
      ) : null}
    </div>
  );
}
