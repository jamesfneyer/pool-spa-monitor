"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getDataModeInfo } from "@/lib/config/data-mode";
import { env } from "@/lib/config/env";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { PoolProfile } from "@/lib/data/types";
import { poolProfileSelectItems } from "@/lib/select-items";
import { cn } from "@/lib/utils";

export function SettingsPage() {
  const provider = useDataProvider();
  const [selectedId, setSelectedId] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<PoolProfile>>({});

  const loader = useCallback(async (p: DataProvider) => p.listPoolProfiles(), []);
  const { data: profiles, loading, error, reload } = useAsyncData(loader);

  const selected = profiles?.find((p) => p.id === selectedId) ?? profiles?.[0];

  useEffect(() => {
    if (profiles?.length && !selectedId) {
      setSelectedId(profiles[0].id);
      setForm(profiles[0]);
    }
  }, [profiles, selectedId]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    setSaving(true);
    try {
      await provider.updatePoolProfile(selected.id, {
        name: form.name,
        gallons: Number(form.gallons),
        surfaceType: form.surfaceType,
        sanitizerType: form.sanitizerType,
        targetFreeChlorineMin: Number(form.targetFreeChlorineMin),
        targetFreeChlorineMax: Number(form.targetFreeChlorineMax),
        targetPHMin: Number(form.targetPHMin),
        targetPHMax: Number(form.targetPHMax),
        targetAlkalinityMin: Number(form.targetAlkalinityMin),
        targetAlkalinityMax: Number(form.targetAlkalinityMax),
        targetCyaMin: Number(form.targetCyaMin),
        targetCyaMax: Number(form.targetCyaMax),
        targetSaltMin: Number(form.targetSaltMin),
        targetSaltMax: Number(form.targetSaltMax),
      });
      await reload();
    } finally {
      setSaving(false);
    }
  }

  const modeInfo = getDataModeInfo(env.dataMode);

  if (loading) return <LoadingState />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage pool profiles and chemistry targets."
        actions={
          profiles?.length ? (
            <Link
              href="/setup?flow=add&returnTo=/settings"
              className={cn(buttonVariants({ variant: "outline" }))}
            >
              Import new pool/spa
            </Link>
          ) : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Environment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>
            Data mode:{" "}
            <span className="font-medium text-foreground">{env.dataMode}</span>
            {env.devAuthBypass ? " · Dev auth bypass enabled" : ""}
          </p>
          <p>
            Provider:{" "}
            <span className="font-medium text-foreground">{modeInfo.provider}</span>
            {" · "}
            Persistence:{" "}
            <span className="font-medium text-foreground">{modeInfo.persistence}</span>
          </p>
          <p>{modeInfo.description}</p>
          {modeInfo.localstackFallback ? (
            <p className="text-amber-600 dark:text-amber-400">
              LocalStack mode is not wired yet. Use <code>pnpm dev:local</code> for
              mock UI work or <code>pnpm sandbox</code> + <code>pnpm dev:auth</code>{" "}
              for DynamoDB-backed testing.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {profiles?.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Set up your first pool or spa</CardTitle>
            <CardDescription>
              Register your pool or spa and equipment to start tracking chemistry and
              maintenance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/setup" className={cn(buttonVariants())}>
              Start setup
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <Label>Active profile</Label>
            <Select
              value={selectedId || profiles![0].id}
              onValueChange={(id: string | null) => {
                if (!id) return;
                const profile = profiles!.find((p) => p.id === id);
                if (profile) {
                  setSelectedId(id);
                  setForm(profile);
                }
              }}
              items={poolProfileSelectItems(profiles!, (p) => `${p.name} (${p.type})`)}
            >
              <SelectTrigger className="w-56">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {profiles!.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({p.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gallons">Gallons</Label>
                  <Input
                    id="gallons"
                    type="number"
                    value={form.gallons ?? ""}
                    onChange={(e) => setForm((f) => ({ ...f, gallons: Number(e.target.value) }))}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Chemistry targets</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                {(
                  [
                    ["targetFreeChlorineMin", "FC min"],
                    ["targetFreeChlorineMax", "FC max"],
                    ["targetPHMin", "pH min"],
                    ["targetPHMax", "pH max"],
                    ["targetAlkalinityMin", "Alk min"],
                    ["targetAlkalinityMax", "Alk max"],
                    ["targetCyaMin", "CYA min"],
                    ["targetCyaMax", "CYA max"],
                    ["targetSaltMin", "Salt min"],
                    ["targetSaltMax", "Salt max"],
                  ] as const
                ).map(([key, label]) => (
                  <div key={key} className="space-y-2">
                    <Label htmlFor={key}>{label}</Label>
                    <Input
                      id={key}
                      type="number"
                      step="0.1"
                      value={form[key] ?? ""}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, [key]: Number(e.target.value) }))
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save settings"}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
