import { format, isPast, isThisWeek } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { MaintenanceTask } from "@/lib/data/types";

interface MaintenanceTaskCardProps {
  task: MaintenanceTask;
  onComplete?: (id: string) => void;
  onSkip?: (id: string) => void;
}

export function MaintenanceTaskCard({
  task,
  onComplete,
  onSkip,
}: MaintenanceTaskCardProps) {
  const due = new Date(task.dueDate);
  const overdue = task.status === "pending" && isPast(due);
  const dueThisWeek = isThisWeek(due);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-2 pb-2">
        <div>
          <CardTitle className="text-base">{task.title}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Due {format(due, "MMM d, yyyy")}
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            task.status === "complete"
              ? "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200"
              : task.status === "skipped"
                ? "border-transparent bg-muted text-muted-foreground"
                : overdue
                  ? "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200"
                  : dueThisWeek
                    ? "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200"
                    : ""
          }
        >
          {task.status === "pending"
            ? overdue
              ? "Overdue"
              : dueThisWeek
                ? "This week"
                : "Pending"
            : task.status}
        </Badge>
      </CardHeader>
      {task.status === "pending" && (onComplete || onSkip) ? (
        <CardContent className="flex gap-2 pt-0">
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
        </CardContent>
      ) : null}
    </Card>
  );
}
