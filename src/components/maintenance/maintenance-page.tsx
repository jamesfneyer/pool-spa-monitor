"use client";

import { format, isPast, isThisWeek } from "date-fns";
import { useCallback, useState } from "react";
import { ClipboardList } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { ChemistryPlanGroup } from "@/components/maintenance/chemistry-plan-group";
import { MaintenanceTaskCard } from "@/components/shared/maintenance-task-card";
import { PageHeader } from "@/components/shared/page-header";
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
import { MAINTENANCE_PRESETS } from "@/lib/constants";
import { poolProfileSelectItems } from "@/lib/select-items";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { MaintenanceTask, PoolProfile } from "@/lib/data/types";

function groupChemistryPlans(tasks: MaintenanceTask[]) {
  const planTasks = tasks.filter(
    (t) => t.status === "pending" && t.recommendationGroupId,
  );
  const groups = new Map<string, MaintenanceTask[]>();

  for (const task of planTasks) {
    const groupId = task.recommendationGroupId as string;
    const existing = groups.get(groupId) ?? [];
    existing.push(task);
    groups.set(groupId, existing);
  }

  return Array.from(groups.entries()).map(([groupId, groupTasks]) => ({
    groupId,
    tasks: groupTasks,
  }));
}

function groupTasks(tasks: MaintenanceTask[]) {
  const pending = tasks.filter(
    (t) => t.status === "pending" && !t.recommendationGroupId,
  );
  const overdue = pending.filter((t) => isPast(new Date(t.dueDate)));
  const thisWeek = pending.filter(
    (t) => !isPast(new Date(t.dueDate)) && isThisWeek(new Date(t.dueDate)),
  );
  const later = pending.filter(
    (t) => !isPast(new Date(t.dueDate)) && !isThisWeek(new Date(t.dueDate)),
  );
  const done = tasks.filter((t) => t.status !== "pending");
  return { overdue, thisWeek, later, done };
}

export function MaintenancePage() {
  const provider = useDataProvider();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    poolProfileId: "",
    title: "",
    category: "Routine",
    dueDate: new Date().toISOString().slice(0, 10),
    recurrence: "",
    notes: "",
  });

  const loader = useCallback(async (p: DataProvider) => {
    const [profiles, tasks] = await Promise.all([
      p.listPoolProfiles(),
      p.listMaintenanceTasks(),
    ]);
    return { profiles, tasks };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await provider.createMaintenanceTask({
      poolProfileId: form.poolProfileId || data!.profiles[0].id,
      title: form.title,
      category: form.category,
      status: "pending",
      dueDate: new Date(form.dueDate).toISOString(),
      recurrence: form.recurrence || null,
      notes: form.notes || null,
    });
    setDialogOpen(false);
    await reload();
  }

  async function markComplete(id: string) {
    await provider.updateMaintenanceTask(id, {
      status: "complete",
      completedAt: new Date().toISOString(),
    });
    await reload();
  }

  async function markSkipped(id: string) {
    await provider.updateMaintenanceTask(id, { status: "skipped" });
    await reload();
  }

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load"}</p>;
  }

  const { profiles, tasks } = data;
  const chemistryPlans = groupChemistryPlans(tasks);
  const groups = groupTasks(tasks);

  const sections = [
    { title: "Overdue", items: groups.overdue },
    { title: "This week", items: groups.thisWeek },
    { title: "Later", items: groups.later },
    { title: "Completed / skipped", items: groups.done },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Maintenance"
        description="Schedule and track recurring pool and spa care."
        actions={<Button onClick={() => setDialogOpen(true)}>Add task</Button>}
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No maintenance tasks"
          description="Add tasks like cleaning baskets, testing water, or inspecting the salt cell."
          action={<Button onClick={() => setDialogOpen(true)}>Add task</Button>}
        />
      ) : (
        <div className="space-y-8">
          {chemistryPlans.length > 0 ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Chemistry action plans</h2>
              <div className="grid gap-4">
                {chemistryPlans.map((plan) => (
                  <ChemistryPlanGroup
                    key={plan.groupId}
                    groupId={plan.groupId}
                    tasks={plan.tasks}
                    onComplete={markComplete}
                    onSkip={markSkipped}
                  />
                ))}
              </div>
            </div>
          ) : null}

          {sections.map(
            (section) =>
              section.items.length > 0 && (
                <div key={section.title} className="space-y-3">
                  <h2 className="text-lg font-semibold">{section.title}</h2>
                  <div className="grid gap-3">
                    {section.items.map((task) => (
                      <MaintenanceTaskCard
                        key={task.id}
                        task={task}
                        onComplete={task.status === "pending" ? markComplete : undefined}
                        onSkip={task.status === "pending" ? markSkipped : undefined}
                      />
                    ))}
                  </div>
                </div>
              ),
          )}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add maintenance task</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Quick presets</Label>
              <div className="flex flex-wrap gap-2">
                {MAINTENANCE_PRESETS.map((preset) => (
                  <Button
                    key={preset}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm((f) => ({ ...f, title: preset }))}
                  >
                    {preset}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Profile</Label>
              <Select
                value={form.poolProfileId || profiles[0]?.id}
                onValueChange={(v) => setForm((f) => ({ ...f, poolProfileId: v ?? "" }))}
                items={poolProfileSelectItems(profiles)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {profiles.map((p: PoolProfile) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                required
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due date</Label>
              <Input
                id="dueDate"
                type="date"
                required
                value={form.dueDate}
                onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recurrence">Recurrence (placeholder)</Label>
              <Input
                id="recurrence"
                placeholder="e.g. weekly, monthly"
                value={form.recurrence}
                onChange={(e) => setForm((f) => ({ ...f, recurrence: e.target.value }))}
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
              Save task
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
