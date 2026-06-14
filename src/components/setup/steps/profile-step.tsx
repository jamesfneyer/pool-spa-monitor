import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SANITIZER_TYPE_OPTIONS,
  SURFACE_TYPE_OPTIONS,
} from "@/lib/setup/profile-defaults";
import type { PoolProfileSetupValues } from "@/lib/validations/pool-profile";
import type { PoolType } from "@/lib/data/types";

interface ProfileStepProps {
  type: PoolType;
  values: PoolProfileSetupValues;
  errors: Partial<Record<keyof PoolProfileSetupValues, string>>;
  onChange: (values: PoolProfileSetupValues) => void;
  onContinue: () => void;
  onBack: () => void;
}

export function ProfileStep({
  type,
  values,
  errors,
  onChange,
  onContinue,
  onBack,
}: ProfileStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">
          {type === "spa" ? "Spa" : "Pool"} details
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Tell us about your {type === "spa" ? "spa" : "pool"}. Chemistry targets use sensible
          defaults and can be adjusted later in Settings.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="setup-name">Name</Label>
          <Input
            id="setup-name"
            value={values.name}
            onChange={(e) => onChange({ ...values, name: e.target.value })}
          />
          {errors.name ? <p className="text-sm text-destructive">{errors.name}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="setup-gallons">Gallons</Label>
          <Input
            id="setup-gallons"
            type="number"
            min={1}
            value={values.gallons}
            onChange={(e) => onChange({ ...values, gallons: Number(e.target.value) })}
          />
          {errors.gallons ? (
            <p className="text-sm text-destructive">{errors.gallons}</p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label>Surface type</Label>
          <Select
            value={values.surfaceType}
            onValueChange={(v: string | null) =>
              onChange({ ...values, surfaceType: v ?? values.surfaceType })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SURFACE_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.surfaceType ? (
            <p className="text-sm text-destructive">{errors.surfaceType}</p>
          ) : null}
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Sanitizer</Label>
          <Select
            value={values.sanitizerType}
            onValueChange={(v: string | null) =>
              onChange({ ...values, sanitizerType: v ?? values.sanitizerType })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SANITIZER_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sanitizerType ? (
            <p className="text-sm text-destructive">{errors.sanitizerType}</p>
          ) : null}
        </div>
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
