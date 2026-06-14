"use client";

import { format } from "date-fns";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Droplets } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { DosingTipsPanel } from "@/components/chemical-dosing/dosing-tips-panel";
import { getDosingTips, type DosingTip } from "@/lib/chemistry/dosing-tips";
import { useRecommendationMaintenance } from "@/lib/chemistry/use-recommendation-maintenance";
import { CHEMICAL_TYPE_LABELS } from "@/lib/constants";
import { poolProfileSelectItems } from "@/lib/select-items";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { ChemicalDose, ChemicalType, PoolProfile } from "@/lib/data/types";

export function ChemicalDosingPage() {
  const provider = useDataProvider();
  const searchParams = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipsDialogOpen, setTipsDialogOpen] = useState(false);
  const [showTipsCard, setShowTipsCard] = useState(false);
  const [activeTips, setActiveTips] = useState<DosingTip[]>([]);
  const [lastLoggedDose, setLastLoggedDose] = useState<{
    chemicalType: ChemicalType;
    amount: number;
    unit: string;
    addedAt: string;
  } | null>(null);
  const [recommendationGroupId, setRecommendationGroupId] = useState<string | null>(
    null,
  );
  const [recommendationPoolProfileId, setRecommendationPoolProfileId] = useState<
    string | null
  >(null);
  const [form, setForm] = useState({
    poolProfileId: "",
    waterTestId: "",
    chemicalType: "liquid_chlorine" as ChemicalType,
    amount: "",
    unit: "oz",
    reason: "",
    addedAt: new Date().toISOString().slice(0, 16),
    notes: "",
  });

  const loader = useCallback(async (p: DataProvider) => {
    const [profiles, doses, tests] = await Promise.all([
      p.listPoolProfiles(),
      p.listChemicalDoses(),
      p.listWaterTests(),
    ]);
    const totals = doses.reduce<Record<string, number>>((acc, dose) => {
      acc[dose.chemicalType] = (acc[dose.chemicalType] ?? 0) + dose.amount;
      return acc;
    }, {});
    return { profiles, doses, tests, totals };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);
  const { addedTipIds, addingTipId, handleAddToMaintenance } =
    useRecommendationMaintenance(recommendationGroupId, recommendationPoolProfileId);

  useEffect(() => {
    if (searchParams.get("add") === "1") setDialogOpen(true);
  }, [searchParams]);

  useEffect(() => {
    if (data?.profiles[0] && !form.poolProfileId) {
      setForm((f) => ({ ...f, poolProfileId: data.profiles[0].id }));
    }
  }, [data, form.poolProfileId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!data) return;

    const amount = Number(form.amount);
    const addedAt = new Date(form.addedAt).toISOString();
    const poolProfile = data.profiles.find((p) => p.id === form.poolProfileId);
    const waterTest = form.waterTestId
      ? data.tests.find((t) => t.id === form.waterTestId)
      : undefined;

    const dose = await provider.createChemicalDose({
      poolProfileId: form.poolProfileId,
      waterTestId: form.waterTestId || null,
      chemicalType: form.chemicalType,
      amount,
      unit: form.unit,
      reason: form.reason || null,
      addedAt,
      notes: form.notes || null,
    });

    if (poolProfile) {
      const tips = getDosingTips({
        chemicalType: form.chemicalType,
        amount,
        unit: form.unit,
        poolProfile,
        waterTest,
      });
      setActiveTips(tips);
      setRecommendationGroupId(`chem-plan-dose-${dose.id}`);
      setRecommendationPoolProfileId(form.poolProfileId);
      setLastLoggedDose({
        chemicalType: form.chemicalType,
        amount,
        unit: form.unit,
        addedAt,
      });
      setShowTipsCard(true);
      setTipsDialogOpen(true);
    }

    setDialogOpen(false);
    await reload();
  }

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load"}</p>;
  }

  const { profiles, doses, tests, totals } = data;
  const profileMap = Object.fromEntries(profiles.map((p: PoolProfile) => [p.id, p]));
  const waterTestSelectItems = {
    "": "None",
    ...Object.fromEntries(
      tests.map((t) => [
        t.id,
        `${profileMap[t.poolProfileId]?.name} — ${format(new Date(t.testedAt), "PP")}`,
      ]),
    ),
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Chemical Dosing"
        description="Log chemical additions and review dosing history."
        actions={<Button onClick={() => setDialogOpen(true)}>Add dose</Button>}
      />

      {showTipsCard && activeTips.length > 0 && lastLoggedDose ? (
        <DosingTipsPanel
          tips={activeTips}
          allTips={activeTips}
          chemicalType={lastLoggedDose.chemicalType}
          subtitle={`${CHEMICAL_TYPE_LABELS[lastLoggedDose.chemicalType]} — ${lastLoggedDose.amount} ${lastLoggedDose.unit} · ${format(new Date(lastLoggedDose.addedAt), "PPp")}`}
          onDismiss={() => setShowTipsCard(false)}
          addedTipIds={addedTipIds}
          addingTipId={addingTipId}
          onAddToMaintenance={(tip) => handleAddToMaintenance(tip, activeTips)}
        />
      ) : null}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="text-base">Calculator coming soon</CardTitle>
          <CardDescription>
            Exact dosing calculators for acid, chlorine, and alkalinity will be added in a
            future update.
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Object.entries(totals).map(([type, total]) => (
          <Card key={type}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {CHEMICAL_TYPE_LABELS[type as ChemicalType]}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{total.toFixed(1)} total</CardContent>
          </Card>
        ))}
      </div>

      {doses.length === 0 ? (
        <EmptyState
          icon={Droplets}
          title="No doses logged"
          description="Record chemical additions to track what you've added over time."
          action={<Button onClick={() => setDialogOpen(true)}>Add dose</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {doses
            .sort((a: ChemicalDose, b: ChemicalDose) => +new Date(b.addedAt) - +new Date(a.addedAt))
            .map((dose: ChemicalDose) => (
              <Card key={dose.id}>
                <CardHeader>
                  <CardTitle className="text-base">
                    {CHEMICAL_TYPE_LABELS[dose.chemicalType]} — {dose.amount} {dose.unit}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {profileMap[dose.poolProfileId]?.name} ·{" "}
                    {format(new Date(dose.addedAt), "PPp")}
                    {dose.waterTestId ? " · Linked to water test" : ""}
                  </p>
                </CardHeader>
                {dose.reason ? (
                  <CardContent className="text-sm text-muted-foreground">{dose.reason}</CardContent>
                ) : null}
              </Card>
            ))}
        </div>
      )}

      <Dialog open={tipsDialogOpen} onOpenChange={setTipsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Dose logged</DialogTitle>
          </DialogHeader>
          {lastLoggedDose ? (
            <DosingTipsPanel
              tips={activeTips}
              allTips={activeTips}
              chemicalType={lastLoggedDose.chemicalType}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add chemical dose</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Profile</Label>
              <Select
                value={form.poolProfileId}
                onValueChange={(v) => setForm((f) => ({ ...f, poolProfileId: v ?? "" }))}
                items={poolProfileSelectItems(profiles)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
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
              <Label>Chemical type</Label>
              <Select
                value={form.chemicalType}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, chemicalType: (v ?? "other") as ChemicalType }))
                }
                items={CHEMICAL_TYPE_LABELS}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CHEMICAL_TYPE_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.1"
                  required
                  value={form.amount}
                  onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Input
                  id="unit"
                  value={form.unit}
                  onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Link to water test (optional)</Label>
              <Select
                value={form.waterTestId}
                onValueChange={(v) => setForm((f) => ({ ...f, waterTestId: v ?? "" }))}
                items={waterTestSelectItems}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {tests.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {profileMap[t.poolProfileId]?.name} — {format(new Date(t.testedAt), "PP")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addedAt">Added at</Label>
              <Input
                id="addedAt"
                type="datetime-local"
                value={form.addedAt}
                onChange={(e) => setForm((f) => ({ ...f, addedAt: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Input
                id="reason"
                value={form.reason}
                onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={form.notes}
                onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full">
              Save dose
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
