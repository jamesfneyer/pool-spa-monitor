import { cn } from "@/lib/utils";
import type { SetupWizardStep } from "@/lib/setup/types";

const STEP_LABELS: Record<Exclude<SetupWizardStep, "welcome" | "addAnother">, string> = {
  type: "Type",
  profile: "Profile",
  equipment: "Equipment",
  review: "Review",
};

const VISIBLE_STEPS: Exclude<SetupWizardStep, "welcome" | "addAnother">[] = [
  "type",
  "profile",
  "equipment",
  "review",
];

interface SetupStepIndicatorProps {
  currentStep: SetupWizardStep;
}

export function SetupStepIndicator({ currentStep }: SetupStepIndicatorProps) {
  if (currentStep === "welcome" || currentStep === "addAnother") {
    return null;
  }

  const currentIndex = VISIBLE_STEPS.indexOf(currentStep);

  return (
    <nav aria-label="Setup progress" className="mb-8">
      <ol className="flex flex-wrap items-center gap-2">
        {VISIBLE_STEPS.map((step, index) => {
          const isActive = step === currentStep;
          const isComplete = index < currentIndex;

          return (
            <li key={step} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="hidden h-px w-6 bg-border sm:block" aria-hidden />
              ) : null}
              <span
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium",
                  isActive && "bg-primary text-primary-foreground",
                  isComplete && !isActive && "bg-muted text-foreground",
                  !isActive && !isComplete && "bg-muted/50 text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex size-5 items-center justify-center rounded-full text-[10px]",
                    isActive && "bg-primary-foreground/20",
                    !isActive && "bg-background/80",
                  )}
                >
                  {index + 1}
                </span>
                {STEP_LABELS[step]}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
