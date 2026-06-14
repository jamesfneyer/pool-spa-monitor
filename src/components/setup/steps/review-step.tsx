import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { SetupProfileDraft } from "@/lib/setup/types";

interface ReviewStepProps {
  draft: SetupProfileDraft;
  saving: boolean;
  onConfirm: () => void;
  onBack: () => void;
}

export function ReviewStep({ draft, saving, onConfirm, onBack }: ReviewStepProps) {
  const enabledEquipment = draft.equipment.filter((item) => item.enabled);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Review</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Confirm your {draft.type === "spa" ? "spa" : "pool"} setup before saving.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{draft.profile.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Type: {draft.type === "spa" ? "Spa" : "Pool"}</p>
          <p>Gallons: {draft.profile.gallons.toLocaleString()}</p>
          <p>Surface: {draft.profile.surfaceType}</p>
          <p>Sanitizer: {draft.profile.sanitizerType}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Equipment</CardTitle>
        </CardHeader>
        <CardContent>
          {enabledEquipment.length === 0 ? (
            <p className="text-sm text-muted-foreground">No equipment selected.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {enabledEquipment.map((item) => (
                <li key={item.category} className="flex flex-col gap-0.5">
                  <span className="font-medium">{item.name}</span>
                  <span className="text-muted-foreground">
                    {EQUIPMENT_CATEGORY_LABELS[item.category]}
                    {item.manufacturer || item.model
                      ? ` · ${[item.manufacturer, item.model].filter(Boolean).join(" ")}`
                      : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack} disabled={saving}>
          Back
        </Button>
        <Button type="button" onClick={onConfirm} disabled={saving}>
          {saving ? "Saving..." : "Save and continue"}
        </Button>
      </div>
    </div>
  );
}
