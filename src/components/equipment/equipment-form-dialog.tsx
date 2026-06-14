"use client";

import { format } from "date-fns";
import { useEffect, useState } from "react";
import { ManufacturerField } from "@/components/equipment/manufacturer-field";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import { poolProfileSelectItems } from "@/lib/select-items";
import { useDataProvider } from "@/lib/data/hooks";
import type { Equipment, EquipmentCategory, PoolProfile } from "@/lib/data/types";

function toDateInputValue(iso: string | null | undefined): string {
  if (!iso) return "";
  return format(new Date(iso), "yyyy-MM-dd");
}

function toIsoOrNull(dateValue: string): string | null {
  return dateValue ? new Date(dateValue).toISOString() : null;
}

interface EquipmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipment: Equipment | null;
  profiles: PoolProfile[];
  onSaved: () => void | Promise<void>;
}

export function EquipmentFormDialog({
  open,
  onOpenChange,
  equipment,
  profiles,
  onSaved,
}: EquipmentFormDialogProps) {
  const provider = useDataProvider();
  const isEditing = equipment !== null;

  const [form, setForm] = useState({
    poolProfileId: "",
    name: "",
    category: "pump" as EquipmentCategory,
    manufacturer: "",
    model: "",
    serialNumber: "",
    installedAt: "",
    warrantyExpiresAt: "",
    notes: "",
  });

  useEffect(() => {
    if (!open) return;

    if (equipment) {
      setForm({
        poolProfileId: equipment.poolProfileId,
        name: equipment.name,
        category: equipment.category,
        manufacturer: equipment.manufacturer ?? "",
        model: equipment.model ?? "",
        serialNumber: equipment.serialNumber ?? "",
        installedAt: toDateInputValue(equipment.installedAt),
        warrantyExpiresAt: toDateInputValue(equipment.warrantyExpiresAt),
        notes: equipment.notes ?? "",
      });
    } else {
      setForm({
        poolProfileId: profiles[0]?.id ?? "",
        name: "",
        category: "pump",
        manufacturer: "",
        model: "",
        serialNumber: "",
        installedAt: "",
        warrantyExpiresAt: "",
        notes: "",
      });
    }
  }, [open, equipment, profiles]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const payload = {
      name: form.name,
      category: form.category,
      manufacturer: form.manufacturer || null,
      model: form.model || null,
      serialNumber: form.serialNumber || null,
      installedAt: toIsoOrNull(form.installedAt),
      warrantyExpiresAt: toIsoOrNull(form.warrantyExpiresAt),
      notes: form.notes || null,
    };

    if (isEditing) {
      await provider.updateEquipment(equipment.id, payload);
    } else {
      await provider.createEquipment({
        poolProfileId: form.poolProfileId || profiles[0].id,
        ...payload,
      });
    }

    onOpenChange(false);
    await onSaved();
  }

  const profileName =
    profiles.find((p) => p.id === form.poolProfileId)?.name ?? "—";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit equipment" : "Add equipment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Profile</Label>
            {isEditing ? (
              <p className="text-sm">{profileName}</p>
            ) : (
              <Select
                value={form.poolProfileId || profiles[0]?.id}
                onValueChange={(v) => setForm((f) => ({ ...f, poolProfileId: v ?? "" }))}
                items={poolProfileSelectItems(profiles)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, category: (v ?? "other") as EquipmentCategory }))
              }
              items={EQUIPMENT_CATEGORY_LABELS}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <ManufacturerField
              category={form.category}
              value={form.manufacturer}
              onChange={(manufacturer) => setForm((f) => ({ ...f, manufacturer }))}
            />
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={form.model}
                onChange={(e) => setForm((f) => ({ ...f, model: e.target.value }))}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial number</Label>
              <Input
                id="serialNumber"
                value={form.serialNumber}
                onChange={(e) => setForm((f) => ({ ...f, serialNumber: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="installedAt">Installed date</Label>
              <Input
                id="installedAt"
                type="date"
                value={form.installedAt}
                onChange={(e) => setForm((f) => ({ ...f, installedAt: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="warrantyExpiresAt">Warranty expires</Label>
            <Input
              id="warrantyExpiresAt"
              type="date"
              value={form.warrantyExpiresAt}
              onChange={(e) => setForm((f) => ({ ...f, warrantyExpiresAt: e.target.value }))}
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
            {isEditing ? "Save changes" : "Save equipment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
