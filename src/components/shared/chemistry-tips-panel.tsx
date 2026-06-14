import { AlertTriangle, Info, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { ChemistryTip } from "@/lib/chemistry/tip-types";
import { cn } from "@/lib/utils";

type ChemistryTipsPanelProps = {
  tips: ChemistryTip[];
  title: string;
  description?: string;
  compact?: boolean;
  onDismiss?: () => void;
  allTips?: ChemistryTip[];
  addedTipIds?: string[];
  onAddToMaintenance?: (tip: ChemistryTip) => Promise<void>;
  addingTipId?: string | null;
};

function TipItem({
  tip,
  compact,
  added,
  adding,
  onAdd,
}: {
  tip: ChemistryTip;
  compact?: boolean;
  added: boolean;
  adding: boolean;
  onAdd?: () => void;
}) {
  const Icon = tip.variant === "warning" ? AlertTriangle : Info;

  return (
    <li
      className={cn(
        "flex gap-3 rounded-lg border p-3",
        tip.variant === "warning"
          ? "border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-950/30"
          : "border-border bg-muted/30",
        compact && "p-2.5",
      )}
    >
      <Icon
        className={cn(
          "mt-0.5 size-4 shrink-0",
          tip.variant === "warning" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground",
        )}
      />
      <div className="min-w-0 flex-1 space-y-2">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium">{tip.title}</p>
            {tip.variant === "warning" ? (
              <Badge variant="outline" className="text-amber-700 dark:text-amber-400">
                Caution
              </Badge>
            ) : null}
          </div>
          <p className={cn("text-muted-foreground", compact ? "text-xs" : "text-sm")}>
            {tip.body}
          </p>
        </div>
        {tip.actionable && onAdd ? (
          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={added || adding}
            onClick={onAdd}
          >
            {added ? "Added" : adding ? "Adding…" : "Add to maintenance"}
          </Button>
        ) : null}
      </div>
    </li>
  );
}

export function ChemistryTipsPanel({
  tips,
  title,
  description,
  compact,
  onDismiss,
  allTips,
  addedTipIds = [],
  onAddToMaintenance,
  addingTipId,
}: ChemistryTipsPanelProps) {
  if (tips.length === 0) return null;

  const tipList = (listTips: ChemistryTip[]) => (
    <ul className={cn("space-y-2", compact ? "space-y-2" : "space-y-3")}>
      {listTips.map((tip) => (
        <TipItem
          key={tip.id}
          tip={tip}
          compact={compact}
          added={addedTipIds.includes(tip.id)}
          adding={addingTipId === tip.id}
          onAdd={
            onAddToMaintenance && tip.actionable
              ? () => onAddToMaintenance(tip)
              : undefined
          }
        />
      ))}
    </ul>
  );

  if (compact) {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-2">
          <Lightbulb className="mt-0.5 size-4 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium">{title}</p>
            {description ? (
              <p className="text-xs text-muted-foreground">{description}</p>
            ) : null}
          </div>
        </div>
        {tipList(tips)}
      </div>
    );
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 size-5 shrink-0 text-primary" />
            <div>
              <CardTitle className="text-base">{title}</CardTitle>
              {description ? <CardDescription>{description}</CardDescription> : null}
            </div>
          </div>
          {onDismiss ? (
            <Button variant="ghost" size="sm" onClick={onDismiss}>
              Dismiss
            </Button>
          ) : null}
        </div>
      </CardHeader>
      <CardContent>{tipList(tips)}</CardContent>
    </Card>
  );
}
