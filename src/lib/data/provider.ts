import type {
  ChemicalDose,
  CreateChemicalDoseInput,
  CreateEquipmentInput,
  CreateMaintenanceTaskInput,
  CreatePoolNoteInput,
  CreatePoolProfileInput,
  CreateWaterTestInput,
  Equipment,
  MaintenanceTask,
  PoolNote,
  PoolProfile,
  UpdateChemicalDoseInput,
  UpdateEquipmentInput,
  UpdateMaintenanceTaskInput,
  UpdatePoolNoteInput,
  UpdatePoolProfileInput,
  UpdateWaterTestInput,
  WaterTest,
} from "./types";

export interface DataProvider {
  listPoolProfiles(): Promise<PoolProfile[]>;
  getPoolProfile(id: string): Promise<PoolProfile | null>;
  createPoolProfile(input: CreatePoolProfileInput): Promise<PoolProfile>;
  updatePoolProfile(
    id: string,
    input: UpdatePoolProfileInput,
  ): Promise<PoolProfile>;
  deletePoolProfile(id: string): Promise<void>;

  listWaterTests(poolProfileId?: string): Promise<WaterTest[]>;
  getWaterTest(id: string): Promise<WaterTest | null>;
  createWaterTest(input: CreateWaterTestInput): Promise<WaterTest>;
  updateWaterTest(id: string, input: UpdateWaterTestInput): Promise<WaterTest>;
  deleteWaterTest(id: string): Promise<void>;

  listChemicalDoses(poolProfileId?: string): Promise<ChemicalDose[]>;
  getChemicalDose(id: string): Promise<ChemicalDose | null>;
  createChemicalDose(input: CreateChemicalDoseInput): Promise<ChemicalDose>;
  updateChemicalDose(
    id: string,
    input: UpdateChemicalDoseInput,
  ): Promise<ChemicalDose>;
  deleteChemicalDose(id: string): Promise<void>;

  listEquipment(poolProfileId?: string): Promise<Equipment[]>;
  getEquipment(id: string): Promise<Equipment | null>;
  createEquipment(input: CreateEquipmentInput): Promise<Equipment>;
  updateEquipment(id: string, input: UpdateEquipmentInput): Promise<Equipment>;
  deleteEquipment(id: string): Promise<void>;

  listMaintenanceTasks(poolProfileId?: string): Promise<MaintenanceTask[]>;
  getMaintenanceTask(id: string): Promise<MaintenanceTask | null>;
  createMaintenanceTask(
    input: CreateMaintenanceTaskInput,
  ): Promise<MaintenanceTask>;
  updateMaintenanceTask(
    id: string,
    input: UpdateMaintenanceTaskInput,
  ): Promise<MaintenanceTask>;
  deleteMaintenanceTask(id: string): Promise<void>;

  listPoolNotes(poolProfileId?: string): Promise<PoolNote[]>;
  getPoolNote(id: string): Promise<PoolNote | null>;
  createPoolNote(input: CreatePoolNoteInput): Promise<PoolNote>;
  updatePoolNote(id: string, input: UpdatePoolNoteInput): Promise<PoolNote>;
  deletePoolNote(id: string): Promise<void>;
}
