"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Beaker } from "lucide-react";
import { ChemistryTipsPanel } from "@/components/shared/chemistry-tips-panel";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getChemistryStatus } from "@/lib/chemistry/status";
import { getTestRecommendations } from "@/lib/chemistry/test-recommendations";
import type { ChemistryTip } from "@/lib/chemistry/tip-types";
import { useRecommendationMaintenance } from "@/lib/chemistry/use-recommendation-maintenance";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { PoolProfile, WaterTest } from "@/lib/data/types";
import { poolProfileFilterItems, poolProfileSelectItems } from "@/lib/select-items";
import {
  waterTestSchema,
  type WaterTestFormValues,
} from "@/lib/validations/water-test";

function toOptionalNumber(value: string | undefined): number | null {
  if (!value?.trim()) return null;
  const num = Number(value);
  return Number.isNaN(num) ? null : num;
}

export function WaterTestsPage() {
  const provider = useDataProvider();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipsDialogOpen, setTipsDialogOpen] = useState(false);
  const [showTipsCard, setShowTipsCard] = useState(false);
  const [activeTips, setActiveTips] = useState<ChemistryTip[]>([]);
  const [lastLoggedTest, setLastLoggedTest] = useState<{
    profileName: string;
    testedAt: string;
  } | null>(null);
  const [recommendationGroupId, setRecommendationGroupId] = useState<string | null>(
    null,
  );
  const [recommendationPoolProfileId, setRecommendationPoolProfileId] = useState<
    string | null
  >(null);
  const [editing, setEditing] = useState<WaterTest | null>(null);
  const [profileFilter, setProfileFilter] = useState<string>("all");

  const loader = useCallback(
    async (p: DataProvider) => {
      const [profiles, tests] = await Promise.all([
        p.listPoolProfiles(),
        p.listWaterTests(),
      ]);
      return { profiles, tests };
    },
    [],
  );

  const { data, loading, error, reload } = useAsyncData(loader);
  const { addedTipIds, addingTipId, handleAddToMaintenance } =
    useRecommendationMaintenance(recommendationGroupId, recommendationPoolProfileId);

  const form = useForm<WaterTestFormValues>({
    resolver: zodResolver(waterTestSchema),
    defaultValues: {
      poolProfileId: "",
      testedAt: new Date().toISOString().slice(0, 16),
      notes: "",
    },
  });

  useEffect(() => {
    if (searchParams.get("add") === "1") {
      setDialogOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (data?.profiles[0] && !form.getValues("poolProfileId")) {
      form.setValue("poolProfileId", data.profiles[0].id);
    }
  }, [data, form]);

  function openCreate() {
    setEditing(null);
    form.reset({
      poolProfileId: data?.profiles[0]?.id ?? "",
      testedAt: new Date().toISOString().slice(0, 16),
      notes: "",
    });
    setDialogOpen(true);
  }

  function openEdit(test: WaterTest) {
    setEditing(test);
    form.reset({
      poolProfileId: test.poolProfileId,
      testedAt: test.testedAt.slice(0, 16),
      freeChlorine: test.freeChlorine != null ? String(test.freeChlorine) : "",
      totalChlorine: test.totalChlorine != null ? String(test.totalChlorine) : "",
      pH: test.pH != null ? String(test.pH) : "",
      alkalinity: test.alkalinity != null ? String(test.alkalinity) : "",
      calciumHardness: test.calciumHardness != null ? String(test.calciumHardness) : "",
      cya: test.cya != null ? String(test.cya) : "",
      salt: test.salt != null ? String(test.salt) : "",
      phosphates: test.phosphates != null ? String(test.phosphates) : "",
      waterTemp: test.waterTemp != null ? String(test.waterTemp) : "",
      notes: test.notes ?? "",
    });
    setDialogOpen(true);
  }

  async function onSubmit(values: WaterTestFormValues) {
    const payload = {
      poolProfileId: values.poolProfileId,
      testedAt: new Date(values.testedAt).toISOString(),
      freeChlorine: toOptionalNumber(values.freeChlorine),
      totalChlorine: toOptionalNumber(values.totalChlorine),
      pH: toOptionalNumber(values.pH),
      alkalinity: toOptionalNumber(values.alkalinity),
      calciumHardness: toOptionalNumber(values.calciumHardness),
      cya: toOptionalNumber(values.cya),
      salt: toOptionalNumber(values.salt),
      phosphates: toOptionalNumber(values.phosphates),
      waterTemp: toOptionalNumber(values.waterTemp),
      notes: values.notes || null,
    };

    if (editing) {
      await provider.updateWaterTest(editing.id, payload);
    } else {
      const created = await provider.createWaterTest(payload);

      const poolProfile = data?.profiles.find((p) => p.id === values.poolProfileId);
      if (poolProfile) {
        const tips = getTestRecommendations(poolProfile, created);
        setActiveTips(tips);
        setRecommendationGroupId(`chem-plan-test-${created.id}`);
        setRecommendationPoolProfileId(values.poolProfileId);
        setLastLoggedTest({
          profileName: poolProfile.name,
          testedAt: payload.testedAt,
        });
        setShowTipsCard(true);
        setTipsDialogOpen(true);
      }
    }

    setDialogOpen(false);
    await reload();
  }

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load"}</p>;
  }

  const { profiles, tests } = data;
  const profileMap = Object.fromEntries(profiles.map((p: PoolProfile) => [p.id, p]));
  const filtered =
    profileFilter === "all"
      ? tests
      : tests.filter((t: WaterTest) => t.poolProfileId === profileFilter);

  const chartProfileId =
    profileFilter === "all" ? profiles[0]?.id : profileFilter;
  const chartData = chartProfileId
    ? tests
        .filter((t: WaterTest) => t.poolProfileId === chartProfileId)
        .sort((a: WaterTest, b: WaterTest) => +new Date(a.testedAt) - +new Date(b.testedAt))
        .map((t: WaterTest) => ({
          date: format(new Date(t.testedAt), "MMM d"),
          pH: t.pH,
          freeChlorine: t.freeChlorine,
        }))
    : [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Water Tests"
        description="Log and review water chemistry results."
        actions={<Button onClick={openCreate}>Add water test</Button>}
      />

      {showTipsCard && activeTips.length > 0 && lastLoggedTest ? (
        <ChemistryTipsPanel
          tips={activeTips}
          allTips={activeTips}
          title="Recommended actions"
          description={`${lastLoggedTest.profileName} — ${format(new Date(lastLoggedTest.testedAt), "PPp")}`}
          onDismiss={() => setShowTipsCard(false)}
          addedTipIds={addedTipIds}
          addingTipId={addingTipId}
          onAddToMaintenance={(tip) => handleAddToMaintenance(tip, activeTips)}
        />
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <Label htmlFor="profile-filter">Profile</Label>
        <Select
          value={profileFilter}
          onValueChange={(v) => setProfileFilter(v ?? "all")}
          items={poolProfileFilterItems(profiles)}
        >
          <SelectTrigger id="profile-filter" className="w-48">
            <SelectValue placeholder="All profiles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All profiles</SelectItem>
            {profiles.map((p: PoolProfile) => (
              <SelectItem key={p.id} value={p.id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Beaker}
          title="No water tests yet"
          description="Add your first test to start tracking chemistry over time."
          action={<Button onClick={openCreate}>Add water test</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {filtered
            .sort((a: WaterTest, b: WaterTest) => +new Date(b.testedAt) - +new Date(a.testedAt))
            .map((test: WaterTest) => {
              const profile = profileMap[test.poolProfileId];
              return (
                <Card key={test.id}>
                  <CardHeader className="flex flex-row items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base">
                        <Link href={`/water-tests/${test.id}`} className="hover:underline">
                          {profile?.name ?? "Profile"} — {format(new Date(test.testedAt), "PPp")}
                        </Link>
                      </CardTitle>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {profile ? (
                          <>
                            <StatusBadge
                              status={getChemistryStatus(
                                test.freeChlorine,
                                profile.targetFreeChlorineMin,
                                profile.targetFreeChlorineMax,
                              )}
                            />
                            <StatusBadge
                              status={getChemistryStatus(
                                test.pH,
                                profile.targetPHMin,
                                profile.targetPHMax,
                              )}
                            />
                          </>
                        ) : null}
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => openEdit(test)}>
                      Edit
                    </Button>
                  </CardHeader>
                  <CardContent className="grid gap-2 text-sm sm:grid-cols-3">
                    <p>FC: {test.freeChlorine ?? "—"} ppm</p>
                    <p>pH: {test.pH ?? "—"}</p>
                    <p>Alk: {test.alkalinity ?? "—"} ppm</p>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}

      {chartData.length > 1 ? (
        <Card>
          <CardHeader>
            <CardTitle>Trends</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="freeChlorine" stroke="var(--chart-1)" />
                <Line type="monotone" dataKey="pH" stroke="var(--chart-2)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      ) : null}

      <Dialog open={tipsDialogOpen} onOpenChange={setTipsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Test logged</DialogTitle>
          </DialogHeader>
          {lastLoggedTest ? (
            <ChemistryTipsPanel
              tips={activeTips}
              allTips={activeTips}
              title="Recommended actions"
              description={`${lastLoggedTest.profileName} — ${format(new Date(lastLoggedTest.testedAt), "PPp")}`}
              compact
              addedTipIds={addedTipIds}
              addingTipId={addingTipId}
              onAddToMaintenance={(tip) => handleAddToMaintenance(tip, activeTips)}
            />
          ) : null}
          <DialogFooter>
            <Button type="button" onClick={() => setTipsDialogOpen(false)}>
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit water test" : "Add water test"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label>Profile</Label>
              <Select
                value={form.watch("poolProfileId")}
                onValueChange={(v) => form.setValue("poolProfileId", v ?? "")}
                items={poolProfileSelectItems(profiles)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select profile" />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p: PoolProfile) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="testedAt">Tested at</Label>
              <Input id="testedAt" type="datetime-local" {...form.register("testedAt")} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["freeChlorine", "Free chlorine (ppm)"],
                  ["totalChlorine", "Total chlorine (ppm)"],
                  ["pH", "pH"],
                  ["alkalinity", "Alkalinity (ppm)"],
                  ["calciumHardness", "Calcium hardness (ppm)"],
                  ["cya", "CYA (ppm)"],
                  ["salt", "Salt (ppm)"],
                  ["phosphates", "Phosphates (ppb)"],
                  ["waterTemp", "Water temp (°F)"],
                ] as const
              ).map(([name, label]) => (
                <div key={name} className="space-y-2">
                  <Label htmlFor={name}>{label}</Label>
                  <Input id={name} type="number" step="0.1" {...form.register(name)} />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" {...form.register("notes")} />
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Save changes" : "Add test"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
