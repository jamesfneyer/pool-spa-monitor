import { Droplets, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { PoolType } from "@/lib/data/types";
import { cn } from "@/lib/utils";

interface TypeStepProps {
  selectedType: PoolType | null;
  onSelect: (type: PoolType) => void;
  onContinue: () => void;
  onBack?: () => void;
}

export function TypeStep({ selectedType, onSelect, onContinue, onBack }: TypeStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">What are you registering?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Choose pool or spa. You can add more after this one.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            {
              type: "pool" as const,
              title: "Pool",
              description: "In-ground or above-ground swimming pool",
              icon: Droplets,
            },
            {
              type: "spa" as const,
              title: "Spa / Hot tub",
              description: "Attached or standalone hot tub",
              icon: Flame,
            },
          ] as const
        ).map(({ type, title, description, icon: Icon }) => {
          const selected = selectedType === type;
          return (
            <button
              key={type}
              type="button"
              onClick={() => onSelect(type)}
              className={cn(
                "rounded-xl border text-left transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                selected
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50",
              )}
            >
              <Card className="border-0 shadow-none">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-accent">
                      <Icon className="size-5 text-accent-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{title}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between gap-3">
        {onBack ? (
          <Button type="button" variant="outline" onClick={onBack}>
            Back
          </Button>
        ) : (
          <span />
        )}
        <Button type="button" disabled={!selectedType} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}
