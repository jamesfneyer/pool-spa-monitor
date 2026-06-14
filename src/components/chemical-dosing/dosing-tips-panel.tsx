import { ChemistryTipsPanel } from "@/components/shared/chemistry-tips-panel";
import { CHEMICAL_TYPE_LABELS } from "@/lib/constants";
import type { ChemistryTip } from "@/lib/chemistry/tip-types";
import type { ChemicalType } from "@/lib/data/types";

type DosingTipsPanelProps = {
  tips: ChemistryTip[];
  chemicalType: ChemicalType;
  subtitle?: string;
  compact?: boolean;
  onDismiss?: () => void;
  allTips?: ChemistryTip[];
  addedTipIds?: string[];
  onAddToMaintenance?: (tip: ChemistryTip) => Promise<void>;
  addingTipId?: string | null;
};

export function DosingTipsPanel({
  tips,
  chemicalType,
  subtitle,
  compact,
  onDismiss,
  allTips,
  addedTipIds,
  onAddToMaintenance,
  addingTipId,
}: DosingTipsPanelProps) {
  return (
    <ChemistryTipsPanel
      tips={tips}
      allTips={allTips ?? tips}
      title="What to do next"
      description={
        subtitle ??
        (compact
          ? `After adding ${CHEMICAL_TYPE_LABELS[chemicalType].toLowerCase()}`
          : `Follow-up steps after adding ${CHEMICAL_TYPE_LABELS[chemicalType].toLowerCase()}`)
      }
      compact={compact}
      onDismiss={onDismiss}
      addedTipIds={addedTipIds}
      onAddToMaintenance={onAddToMaintenance}
      addingTipId={addingTipId}
    />
  );
}
