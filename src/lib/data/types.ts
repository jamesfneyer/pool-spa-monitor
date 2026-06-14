export type PoolType = "pool" | "spa";
export type MaintenanceStatus = "pending" | "complete" | "skipped";

export type ChemicalType =
  | "liquid_chlorine"
  | "muriatic_acid"
  | "baking_soda"
  | "calcium_chloride"
  | "cyanuric_acid"
  | "salt"
  | "phosphate_remover"
  | "clarifier"
  | "shock"
  | "other";

export type EquipmentCategory =
  | "pump"
  | "filter"
  | "heater"
  | "salt_cell"
  | "robot_cleaner"
  | "automation"
  | "spa"
  | "other";

export interface PoolProfile {
  id: string;
  name: string;
  type: PoolType;
  gallons: number;
  surfaceType: string;
  sanitizerType: string;
  targetFreeChlorineMin: number;
  targetFreeChlorineMax: number;
  targetPHMin: number;
  targetPHMax: number;
  targetAlkalinityMin: number;
  targetAlkalinityMax: number;
  targetCyaMin: number;
  targetCyaMax: number;
  targetSaltMin: number;
  targetSaltMax: number;
  createdAt: string;
  updatedAt: string;
}

export interface WaterTest {
  id: string;
  poolProfileId: string;
  testedAt: string;
  freeChlorine?: number | null;
  totalChlorine?: number | null;
  pH?: number | null;
  alkalinity?: number | null;
  calciumHardness?: number | null;
  cya?: number | null;
  salt?: number | null;
  phosphates?: number | null;
  waterTemp?: number | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ChemicalDose {
  id: string;
  poolProfileId: string;
  waterTestId?: string | null;
  chemicalType: ChemicalType;
  amount: number;
  unit: string;
  reason?: string | null;
  addedAt: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Equipment {
  id: string;
  poolProfileId: string;
  name: string;
  category: EquipmentCategory;
  manufacturer?: string | null;
  model?: string | null;
  serialNumber?: string | null;
  installedAt?: string | null;
  warrantyExpiresAt?: string | null;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface MaintenanceTask {
  id: string;
  poolProfileId: string;
  title: string;
  category: string;
  status: MaintenanceStatus;
  dueDate: string;
  completedAt?: string | null;
  recurrence?: string | null;
  notes?: string | null;
  recommendationGroupId?: string | null;
  sourceTipId?: string | null;
  sequenceOrder?: number | null;
  delayAfterPreviousMinutes?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface PoolNote {
  id: string;
  poolProfileId: string;
  title: string;
  body: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export type CreatePoolProfileInput = Omit<
  PoolProfile,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdatePoolProfileInput = Partial<CreatePoolProfileInput>;

export type CreateWaterTestInput = Omit<
  WaterTest,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateWaterTestInput = Partial<
  Omit<CreateWaterTestInput, "poolProfileId">
>;

export type CreateChemicalDoseInput = Omit<
  ChemicalDose,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateChemicalDoseInput = Partial<
  Omit<CreateChemicalDoseInput, "poolProfileId">
>;

export type CreateEquipmentInput = Omit<
  Equipment,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateEquipmentInput = Partial<
  Omit<CreateEquipmentInput, "poolProfileId">
>;

export type CreateMaintenanceTaskInput = Omit<
  MaintenanceTask,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateMaintenanceTaskInput = Partial<
  Omit<CreateMaintenanceTaskInput, "poolProfileId">
>;

export type CreatePoolNoteInput = Omit<
  PoolNote,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdatePoolNoteInput = Partial<
  Omit<CreatePoolNoteInput, "poolProfileId">
>;
