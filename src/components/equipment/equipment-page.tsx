"use client";

import { useCallback, useState } from "react";
import { Wrench } from "lucide-react";
import { EquipmentFormDialog } from "@/components/equipment/equipment-form-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { EquipmentCard } from "@/components/shared/equipment-card";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import { EQUIPMENT_CATEGORY_FILTER_ITEMS } from "@/lib/select-items";
import { useAsyncData } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { Equipment } from "@/lib/data/types";

export function EquipmentPage() {
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Equipment | null>(null);

  const loader = useCallback(async (p: DataProvider) => {
    const [profiles, equipment] = await Promise.all([
      p.listPoolProfiles(),
      p.listEquipment(),
    ]);
    return { profiles, equipment };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  function openCreate() {
    setEditingItem(null);
    setDialogOpen(true);
  }

  function openEdit(item: Equipment) {
    setEditingItem(item);
    setDialogOpen(true);
  }

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load"}</p>;
  }

  const { profiles, equipment } = data;
  const filtered =
    categoryFilter === "all"
      ? equipment
      : equipment.filter((e) => e.category === categoryFilter);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment"
        description="Track pumps, filters, heaters, and warranty dates."
        actions={<Button onClick={openCreate}>Add equipment</Button>}
      />

      <div className="flex flex-wrap items-center gap-3">
        <Label htmlFor="category-filter">Category</Label>
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v ?? "all")}
          items={EQUIPMENT_CATEGORY_FILTER_ITEMS}
        >
          <SelectTrigger id="category-filter" className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No equipment yet"
          description="Add your pump, filter, heater, and other gear to track warranties."
          action={<Button onClick={openCreate}>Add equipment</Button>}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((item) => (
            <EquipmentCard key={item.id} item={item} onEdit={openEdit} />
          ))}
        </div>
      )}

      <EquipmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        equipment={editingItem}
        profiles={profiles}
        onSaved={reload}
      />
    </div>
  );
}
