"use client";

import { format } from "date-fns";
import Link from "next/link";
import { useCallback } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { EquipmentCard } from "@/components/shared/equipment-card";
import { LoadingState } from "@/components/shared/loading-state";
import { MaintenanceTaskCard } from "@/components/shared/maintenance-task-card";
import { MetricCard } from "@/components/shared/metric-card";
import { PageHeader } from "@/components/shared/page-header";
import { WaterChemistrySummary } from "@/components/shared/water-chemistry-summary";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CHEMICAL_TYPE_LABELS } from "@/lib/constants";
import { useAsyncData } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { PoolProfile, WaterTest } from "@/lib/data/types";

function latestTestForProfile(tests: WaterTest[], profileId: string) {
  return (
    tests
      .filter((t) => t.poolProfileId === profileId)
      .sort((a, b) => +new Date(b.testedAt) - +new Date(a.testedAt))[0] ?? null
  );
}

export default function DashboardPage() {
  const loader = useCallback(async (provider: DataProvider) => {
    const [profiles, tests, doses, tasks, equipment] = await Promise.all([
      provider.listPoolProfiles(),
      provider.listWaterTests(),
      provider.listChemicalDoses(),
      provider.listMaintenanceTasks(),
      provider.listEquipment(),
    ]);

    const pendingTasks = tasks
      .filter((t) => t.status === "pending")
      .sort((a, b) => +new Date(a.dueDate) - +new Date(b.dueDate))
      .slice(0, 5);

    const recentDoses = doses
      .sort((a, b) => +new Date(b.addedAt) - +new Date(a.addedAt))
      .slice(0, 5);

    const primaryProfile = profiles[0];
    const profileTests = primaryProfile
      ? tests
          .filter((t) => t.poolProfileId === primaryProfile.id)
          .sort((a, b) => +new Date(a.testedAt) - +new Date(b.testedAt))
          .slice(-8)
          .map((t) => ({
            date: format(new Date(t.testedAt), "MMM d"),
            pH: t.pH ?? null,
            freeChlorine: t.freeChlorine ?? null,
          }))
      : [];

    return { profiles, tests, pendingTasks, recentDoses, profileTests, equipment };
  }, []);

  const { data, loading, error } = useAsyncData(loader);

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load dashboard"}</p>;
  }

  const { profiles, tests, pendingTasks, recentDoses, profileTests } = data;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Overview of your pool and spa at a glance."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link href="/water-tests?add=1" className={cn(buttonVariants())}>
              Add water test
            </Link>
            <Link
              href="/chemical-dosing?add=1"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Add dose
            </Link>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard title="Profiles" value={profiles.length} />
        <MetricCard title="Water tests" value={tests.length} />
        <MetricCard title="Pending tasks" value={pendingTasks.length} />
        <MetricCard title="Equipment" value={data.equipment.length} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {profiles.map((profile: PoolProfile) => (
          <Card key={profile.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {profile.name}{" "}
                <span className="text-sm font-normal text-muted-foreground">
                  ({profile.type})
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <WaterChemistrySummary
                profile={profile}
                test={latestTestForProfile(tests, profile.id)}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {profileTests.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>pH & free chlorine trends</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={profileTests}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" domain={[0, 10]} />
                <YAxis yAxisId="right" orientation="right" domain={[6, 8]} />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="freeChlorine"
                  name="Free chlorine (ppm)"
                  stroke="var(--chart-1)"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pH"
                  name="pH"
                  stroke="var(--chart-2)"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Upcoming maintenance</h2>
          {pendingTasks.length === 0 ? (
            <p className="text-sm text-muted-foreground">No pending tasks.</p>
          ) : (
            pendingTasks.map((task) => (
              <MaintenanceTaskCard key={task.id} task={task} />
            ))
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent chemical additions</h2>
          {recentDoses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No doses logged yet.</p>
          ) : (
            <Card>
              <CardContent className="divide-y p-0">
                {recentDoses.map((dose) => (
                  <div key={dose.id} className="flex justify-between px-4 py-3 text-sm">
                    <div>
                      <p className="font-medium">
                        {CHEMICAL_TYPE_LABELS[dose.chemicalType]}
                      </p>
                      <p className="text-muted-foreground">
                        {dose.amount} {dose.unit}
                      </p>
                    </div>
                    <p className="text-muted-foreground">
                      {format(new Date(dose.addedAt), "MMM d")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Equipment highlights</h2>
          <Link href="/equipment" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {data.equipment.slice(0, 2).map((item) => (
            <EquipmentCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
