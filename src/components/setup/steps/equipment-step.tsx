import { ManufacturerField } from "@/components/equipment/manufacturer-field";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getEquipmentPresetsForType, type EquipmentSelection } from "@/lib/setup/equipment-presets";
import type { PoolType } from "@/lib/data/types";

interface EquipmentStepProps {
  type: PoolType;
  selections: EquipmentSelection[];
  onChange: (selections: EquipmentSelection[]) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function EquipmentStep({
  type,
  selections,
  onChange,
  onContinue,
  onBack,
}: EquipmentStepProps) {
  const presets = getEquipmentPresetsForType(type);

  function updateSelection(index: number, patch: Partial<EquipmentSelection>) {
    onChange(selections.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Equipment</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select the equipment you have for this {type === "spa" ? "spa" : "pool"}. You can skip
          any items and add details later.
        </p>
      </div>

      <div className="space-y-4">
        {presets.map((preset, index) => {
          const selection = selections[index];
          if (!selection) return null;

          return (
            <div key={preset.category} className="rounded-lg border p-4">
              <div className="flex items-start gap-3">
                <Checkbox
                  id={`equip-${preset.category}`}
                  checked={selection.enabled}
                  onCheckedChange={(checked) =>
                    updateSelection(index, { enabled: checked === true })
                  }
                />
                <div className="min-w-0 flex-1 space-y-3">
                  <Label htmlFor={`equip-${preset.category}`} className="cursor-pointer">
                    {preset.label}
                  </Label>

                  {selection.enabled ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor={`equip-name-${preset.category}`}>Name</Label>
                        <Input
                          id={`equip-name-${preset.category}`}
                          value={selection.name}
                          onChange={(e) => updateSelection(index, { name: e.target.value })}
                        />
                      </div>
                      <ManufacturerField
                        id={`equip-mfg-${preset.category}`}
                        category={preset.category}
                        value={selection.manufacturer}
                        onChange={(manufacturer) => updateSelection(index, { manufacturer })}
                      />
                      <div className="space-y-2">
                        <Label htmlFor={`equip-model-${preset.category}`}>Model</Label>
                        <Input
                          id={`equip-model-${preset.category}`}
                          value={selection.model}
                          onChange={(e) => updateSelection(index, { model: e.target.value })}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between gap-3">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="button" onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
