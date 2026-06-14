import { format, isPast, differenceInDays } from "date-fns";
import { Pencil } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { Equipment } from "@/lib/data/types";

function warrantyStatus(warrantyExpiresAt: string | null | undefined) {
  if (!warrantyExpiresAt) return null;
  const expiry = new Date(warrantyExpiresAt);
  if (isPast(expiry)) return "expired" as const;
  if (differenceInDays(expiry, new Date()) <= 90) return "expiring" as const;
  return "ok" as const;
}

interface EquipmentCardProps {
  item: Equipment;
  onEdit?: (item: Equipment) => void;
}

export function EquipmentCard({ item, onEdit }: EquipmentCardProps) {
  const warranty = warrantyStatus(item.warrantyExpiresAt);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base">
            <Link href={`/equipment/${item.id}`} className="hover:underline">
              {item.name}
            </Link>
          </CardTitle>
          <div className="flex shrink-0 items-center gap-1">
            {onEdit ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Edit equipment"
                onClick={() => onEdit(item)}
              >
                <Pencil />
              </Button>
            ) : null}
            {warranty ? (
              <Badge
                variant="outline"
                className={
                  warranty === "expired"
                    ? "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                    : warranty === "expiring"
                      ? "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                      : "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
                }
              >
                {warranty === "expired"
                  ? "Warranty expired"
                  : warranty === "expiring"
                    ? "Expiring soon"
                    : "Warranty OK"}
              </Badge>
            ) : null}
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {EQUIPMENT_CATEGORY_LABELS[item.category]}
          {item.manufacturer ? ` · ${item.manufacturer}` : ""}
        </p>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {item.warrantyExpiresAt
          ? `Warranty expires ${format(new Date(item.warrantyExpiresAt), "MMM d, yyyy")}`
          : "No warranty date on file"}
      </CardContent>
    </Card>
  );
}
