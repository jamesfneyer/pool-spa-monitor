import type { EquipmentSelection } from "@/lib/setup/equipment-presets";
import type { PoolProfileSetupValues } from "@/lib/validations/pool-profile";
import type { PoolType } from "@/lib/data/types";

export type SetupWizardStep =
  | "welcome"
  | "type"
  | "profile"
  | "equipment"
  | "review"
  | "addAnother";

export interface SetupProfileDraft {
  type: PoolType;
  profile: PoolProfileSetupValues;
  equipment: EquipmentSelection[];
}
