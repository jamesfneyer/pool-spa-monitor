import { format } from "date-fns";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDelayMinutes } from "@/lib/chemistry/tip-to-maintenance";
import type { MaintenanceTask } from "@/lib/data/types";

type ChemistryPlanGroupProps = {
  groupId: string;
  tasks: MaintenanceTask[];
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
};

export function ChemistryPlanGroup({
  tasks,
  onComplete,
  onSkip,
}: ChemistryPlanGroupProps) {
  const sorted = [...tasks].sort(
    (a, b) => (a.sequenceOrder ?? 0) - (b.sequenceOrder ?? 0),
  );

  return (
    <Card className="border-primary/20">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Chemistry action plan</CardTitle>
        <p className="text-sm text-muted-foreground">
          {sorted.length} step{sorted.length === 1 ? "" : "s"} in recommended order
        </p>
      </CardHeader>
      <CardContent className="space-y-0">
        {sorted.map((task, index) => (
          <div key={task.id}>
            {index > 0 && (task.delayAfterPreviousMinutes ?? 0) > 0 ? (
              <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
                <ArrowDown className="size-3 shrink-0" />
                <span>
                  Wait {formatDelayMinutes(task.delayAfterPreviousMinutes ?? 0).toLowerCase()}
                </span>
              </div>
            ) : null}
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-1">
                  <p className="text-xs font-medium text-primary">
                    Step {task.sequenceOrder ?? index + 1}
                  </p>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-muted-foreground">
                    Due {format(new Date(task.dueDate), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                  {task.notes ? (
                    <p className="text-sm text-muted-foreground">{task.notes}</p>
                  ) : null}
                </div>
              </div>
              {task.status === "pending" && (onComplete || onSkip) ? (
                <div className="mt-3 flex gap-2">
                  {onComplete ? (
                    <Button size="sm" onClick={() => onComplete(task.id)}>
                      Complete
                    </Button>
                  ) : null}
                  {onSkip ? (
                    <Button size="sm" variant="outline" onClick={() => onSkip(task.id)}>
                      Skip
                    </Button>
                  ) : null}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
