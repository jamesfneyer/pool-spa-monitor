import { addMinutes } from "date-fns";
import type { ChemistryTip } from "@/lib/chemistry/tip-types";
import type { CreateMaintenanceTaskInput, MaintenanceTask } from "@/lib/data/types";

export function formatDelayMinutes(minutes: number): string {
  if (minutes <= 0) return "Now";
  if (minutes < 60) return `${minutes} minutes`;
  if (minutes < 1440) {
    const hours = Math.round(minutes / 60);
    return hours === 1 ? "1 hour" : `${hours} hours`;
  }
  if (minutes < 10080) {
    const days = Math.round(minutes / 1440);
    return days === 1 ? "1 day" : `${days} days`;
  }
  const weeks = Math.round(minutes / 10080);
  return weeks === 1 ? "1 week" : `${weeks} weeks`;
}

export function computeTipDueDate(
  tips: ChemistryTip[],
  targetTip: ChemistryTip,
  baseTime: Date = new Date(),
): Date {
  const sorted = [...tips].sort((a, b) => a.sortOrder - b.sortOrder);
  let totalMinutes = 0;

  for (const tip of sorted) {
    totalMinutes += tip.delayAfterPreviousMinutes;
    if (tip.id === targetTip.id) break;
  }

  return addMinutes(baseTime, totalMinutes);
}

export function isTipAlreadyAdded(
  tasks: MaintenanceTask[],
  recommendationGroupId: string,
  sourceTipId: string,
): boolean {
  return tasks.some(
    (task) =>
      task.status === "pending" &&
      task.recommendationGroupId === recommendationGroupId &&
      task.sourceTipId === sourceTipId,
  );
}

export function buildMaintenanceTaskFromTip({
  tip,
  tips,
  poolProfileId,
  recommendationGroupId,
  baseTime = new Date(),
}: {
  tip: ChemistryTip;
  tips: ChemistryTip[];
  poolProfileId: string;
  recommendationGroupId: string;
  baseTime?: Date;
}): CreateMaintenanceTaskInput {
  return {
    poolProfileId,
    title: tip.title,
    category: "Chemistry",
    status: "pending",
    dueDate: computeTipDueDate(tips, tip, baseTime).toISOString(),
    notes: tip.body,
    recurrence: null,
    recommendationGroupId,
    sourceTipId: tip.id,
    sequenceOrder: tip.sortOrder,
    delayAfterPreviousMinutes: tip.delayAfterPreviousMinutes,
  };
}
