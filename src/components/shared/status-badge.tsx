import { Badge } from "@/components/ui/badge";
import type { ChemistryStatus } from "@/lib/chemistry/status";
import { chemistryStatusLabels } from "@/lib/chemistry/status";
import { cn } from "@/lib/utils";

const statusStyles: Record<ChemistryStatus, string> = {
  low: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  in_range: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200",
  high: "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200",
  missing: "bg-muted text-muted-foreground",
};

interface StatusBadgeProps {
  status: ChemistryStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="outline" className={cn("border-transparent", statusStyles[status], className)}>
      {chemistryStatusLabels[status]}
    </Badge>
  );
}
