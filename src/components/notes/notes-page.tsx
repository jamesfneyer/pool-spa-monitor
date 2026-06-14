"use client";

import { format } from "date-fns";
import { useCallback, useState } from "react";
import { NotebookPen } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { poolProfileSelectItems } from "@/lib/select-items";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { PoolNote, PoolProfile } from "@/lib/data/types";

export function NotesPage() {
  const provider = useDataProvider();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PoolNote | null>(null);
  const [form, setForm] = useState({
    poolProfileId: "",
    title: "",
    body: "",
    category: "General",
  });

  const loader = useCallback(async (p: DataProvider) => {
    const [profiles, notes] = await Promise.all([
      p.listPoolProfiles(),
      p.listPoolNotes(),
    ]);
    return { profiles, notes };
  }, []);

  const { data, loading, error, reload } = useAsyncData(loader);

  function openCreate() {
    setEditing(null);
    setForm({
      poolProfileId: data?.profiles[0]?.id ?? "",
      title: "",
      body: "",
      category: "General",
    });
    setDialogOpen(true);
  }

  function openEdit(note: PoolNote) {
    setEditing(note);
    setForm({
      poolProfileId: note.poolProfileId,
      title: note.title,
      body: note.body,
      category: note.category,
    });
    setDialogOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (editing) {
      await provider.updatePoolNote(editing.id, form);
    } else {
      await provider.createPoolNote(form);
    }
    setDialogOpen(false);
    await reload();
  }

  async function handleDelete(id: string) {
    await provider.deletePoolNote(id);
    await reload();
  }

  if (loading) return <LoadingState />;
  if (error || !data) {
    return <p className="text-sm text-destructive">{error ?? "Failed to load"}</p>;
  }

  const { profiles, notes } = data;
  const profileMap = Object.fromEntries(profiles.map((p: PoolProfile) => [p.id, p]));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notes"
        description="Seasonal notes, service visits, and reminders."
        actions={<Button onClick={openCreate}>Add note</Button>}
      />

      {notes.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notes yet"
          description="Capture seasonal changes, contractor visits, and other pool memories."
          action={<Button onClick={openCreate}>Add note</Button>}
        />
      ) : (
        <div className="grid gap-4">
          {notes
            .sort((a: PoolNote, b: PoolNote) => +new Date(b.updatedAt) - +new Date(a.updatedAt))
            .map((note: PoolNote) => (
              <Card key={note.id}>
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{note.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {profileMap[note.poolProfileId]?.name} · {note.category} ·{" "}
                      {format(new Date(note.updatedAt), "PP")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(note)}>
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleDelete(note.id)}
                    >
                      Delete
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {note.body}
                </CardContent>
              </Card>
            ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit note" : "Add note"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Profile</Label>
              <Select
                value={form.poolProfileId}
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
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Body</Label>
              <Textarea
                id="body"
                required
                rows={5}
                value={form.body}
                onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              />
            </div>
            <Button type="submit" className="w-full">
              {editing ? "Save changes" : "Add note"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
