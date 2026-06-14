"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoadingState } from "@/components/shared/loading-state";
import { SetupStepIndicator } from "@/components/setup/setup-step-indicator";
import { AddAnotherStep } from "@/components/setup/steps/add-another-step";
import { EquipmentStep } from "@/components/setup/steps/equipment-step";
import { ProfileStep } from "@/components/setup/steps/profile-step";
import { ReviewStep } from "@/components/setup/steps/review-step";
import { TypeStep } from "@/components/setup/steps/type-step";
import { WelcomeStep } from "@/components/setup/steps/welcome-step";
import { createDefaultEquipmentSelections } from "@/lib/setup/equipment-presets";
import {
  buildCreatePoolProfileInput,
  defaultProfileFields,
} from "@/lib/setup/profile-defaults";
import type { SetupProfileDraft, SetupWizardStep } from "@/lib/setup/types";
import { poolProfileSetupSchema } from "@/lib/validations/pool-profile";
import { useAsyncData, useDataProvider } from "@/lib/data/hooks";
import type { DataProvider } from "@/lib/data/provider";
import type { PoolType } from "@/lib/data/types";

function createDraft(type: PoolType): SetupProfileDraft {
  const defaults = defaultProfileFields(type);
  return {
    type,
    profile: {
      name: defaults.name,
      gallons: defaults.gallons,
      surfaceType: defaults.surfaceType,
      sanitizerType: defaults.sanitizerType,
    },
    equipment: createDefaultEquipmentSelections(type),
  };
}

export function SetupWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = useDataProvider();
  const isAddFlow = searchParams.get("flow") === "add";
  const returnTo = searchParams.get("returnTo") ?? (isAddFlow ? "/settings" : "/dashboard");

  const loader = useCallback(async (p: DataProvider) => p.listPoolProfiles(), []);
  const { data: profiles, loading } = useAsyncData(loader);

  const [step, setStep] = useState<SetupWizardStep>("welcome");
  const [stepInitialized, setStepInitialized] = useState(false);
  const [selectedType, setSelectedType] = useState<PoolType | null>(null);
  const [draft, setDraft] = useState<SetupProfileDraft | null>(null);
  const [profileErrors, setProfileErrors] = useState<
    Partial<Record<keyof SetupProfileDraft["profile"], string>>
  >({});
  const [saving, setSaving] = useState(false);
  const [savedCount, setSavedCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const finishLabel = useMemo(
    () => (isAddFlow ? "Back to settings" : "Go to dashboard"),
    [isAddFlow],
  );

  function startNewProfile(type: PoolType) {
    setSelectedType(type);
    setDraft(createDraft(type));
    setProfileErrors({});
    setStep("profile");
  }

  function handleTypeSelect(type: PoolType) {
    setSelectedType(type);
    setDraft(createDraft(type));
  }

  function handleProfileContinue() {
    if (!draft) return;

    const result = poolProfileSetupSchema.safeParse(draft.profile);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof SetupProfileDraft["profile"], string>> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string" && !fieldErrors[field as keyof SetupProfileDraft["profile"]]) {
          fieldErrors[field as keyof SetupProfileDraft["profile"]] = issue.message;
        }
      }
      setProfileErrors(fieldErrors);
      return;
    }

    setProfileErrors({});
    setStep("equipment");
  }

  async function handleSaveDraft() {
    if (!draft) return;

    setSaving(true);
    setError(null);

    try {
      const profile = await provider.createPoolProfile(
        buildCreatePoolProfileInput(draft.type, draft.profile),
      );

      for (const item of draft.equipment) {
        if (!item.enabled) continue;

        await provider.createEquipment({
          poolProfileId: profile.id,
          name: item.name.trim() || item.category,
          category: item.category,
          manufacturer: item.manufacturer.trim() || null,
          model: item.model.trim() || null,
          serialNumber: null,
          installedAt: null,
          warrantyExpiresAt: null,
          notes: null,
        });
      }

      setSavedCount((count) => count + 1);
      setStep("addAnother");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save setup");
    } finally {
      setSaving(false);
    }
  }

  function handleAddAnother() {
    setSelectedType(null);
    setDraft(null);
    setProfileErrors({});
    setStep("type");
  }

  function handleFinish() {
    router.push(returnTo);
  }

  useEffect(() => {
    if (loading || profiles == null || stepInitialized) {
      return;
    }

    setStepInitialized(true);
    if (isAddFlow || profiles.length > 0) {
      setStep("type");
    }
  }, [isAddFlow, loading, profiles, stepInitialized]);

  if (loading || !stepInitialized) return <LoadingState />;

  const showWelcome = (profiles?.length ?? 0) === 0 && step === "welcome";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SetupStepIndicator currentStep={step} />

      {error ? <p className="mb-4 text-sm text-destructive">{error}</p> : null}

      {showWelcome ? <WelcomeStep onContinue={() => setStep("type")} /> : null}

      {step === "type" ? (
        <TypeStep
          selectedType={selectedType}
          onSelect={handleTypeSelect}
          onContinue={() => selectedType && startNewProfile(selectedType)}
          onBack={savedCount > 0 ? () => setStep("addAnother") : isAddFlow ? undefined : () => setStep("welcome")}
        />
      ) : null}

      {step === "profile" && draft ? (
        <ProfileStep
          type={draft.type}
          values={draft.profile}
          errors={profileErrors}
          onChange={(profile) => setDraft({ ...draft, profile })}
          onContinue={handleProfileContinue}
          onBack={() => setStep("type")}
        />
      ) : null}

      {step === "equipment" && draft ? (
        <EquipmentStep
          type={draft.type}
          selections={draft.equipment}
          onChange={(equipment) => setDraft({ ...draft, equipment })}
          onContinue={() => setStep("review")}
          onBack={() => setStep("profile")}
        />
      ) : null}

      {step === "review" && draft ? (
        <ReviewStep
          draft={draft}
          saving={saving}
          onConfirm={() => void handleSaveDraft()}
          onBack={() => setStep("equipment")}
        />
      ) : null}

      {step === "addAnother" ? (
        <AddAnotherStep
          savedCount={savedCount}
          finishLabel={finishLabel}
          onAddAnother={handleAddAnother}
          onFinish={handleFinish}
        />
      ) : null}
    </div>
  );
}
