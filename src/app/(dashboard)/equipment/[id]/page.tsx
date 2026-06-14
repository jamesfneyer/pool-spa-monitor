"use client";

import { format } from "date-fns";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useState } from "react";
import { EquipmentFormDialog } from "@/components/equipment/equipment-form-dialog";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import { useAsyncData } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import { cn } from "@/lib/utils";

export default function EquipmentDetailPage() {
  const params = useParams();
  const id = String(params.id);
  const [editOpen, setEditOpen] = useState(false);

  const loader = useCallback(async (provider: DataProvider) => {
    const item = await provider.getEquipment(id);
    if (!item) return null;
    const [profile, profiles] = await Promise.all([
      provider.getPoolProfile(item.poolProfileId),
      provider.listPoolProfiles(),
    ]);
    return { item, profile, profiles };
  }, [id]);

  const { data, loading, error, reload } = useAsyncData(loader, [id]);

  if (loading) return <LoadingState />;
  if (error) return <p className="text-sm text-destructive">{error}</p>;
  if (!data) return <p className="text-sm text-muted-foreground">Equipment not found.</p>;

  const { item, profile, profiles } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={item.name}
        description={`${EQUIPMENT_CATEGORY_LABELS[item.category]}${profile ? ` · ${profile.name}` : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              aria-label="Edit equipment"
              onClick={() => setEditOpen(true)}
            >
              <Pencil />
            </Button>
            <Link href="/equipment" className={cn(buttonVariants({ variant: "outline" }))}>
              Back to list
            </Link>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 text-sm sm:grid-cols-2">
          <p>Manufacturer: {item.manufacturer ?? "—"}</p>
          <p>Model: {item.model ?? "—"}</p>
          <p>Serial: {item.serialNumber ?? "—"}</p>
          <p>
            Installed:{" "}
            {item.installedAt ? format(new Date(item.installedAt), "PP") : "—"}
          </p>
          <p>
            Warranty expires:{" "}
            {item.warrantyExpiresAt
              ? format(new Date(item.warrantyExpiresAt), "PP")
              : "—"}
          </p>
        </CardContent>
      </Card>

      {item.notes ? (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">{item.notes}</CardContent>
        </Card>
      ) : null}

      <EquipmentFormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        equipment={item}
        profiles={profiles}
        onSaved={reload}
      />
    </div>
  );
}
