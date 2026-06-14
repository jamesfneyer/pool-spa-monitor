import type {
  ChemicalDose,
  Equipment,
  MaintenanceTask,
  PoolNote,
  PoolProfile,
  WaterTest,
} from "../types";

export interface MockStore {
  poolProfiles: PoolProfile[];
  waterTests: WaterTest[];
  chemicalDoses: ChemicalDose[];
  equipment: Equipment[];
  maintenanceTasks: MaintenanceTask[];
  poolNotes: PoolNote[];
}

let store: MockStore = {
  poolProfiles: [],
  waterTests: [],
  chemicalDoses: [],
  equipment: [],
  maintenanceTasks: [],
  poolNotes: [],
};

export function getMockStore(): MockStore {
  return store;
}

export function setMockStore(next: MockStore): void {
  store = next;
}

export function resetMockStore(): void {
  store = {
    poolProfiles: [],
    waterTests: [],
    chemicalDoses: [],
    equipment: [],
    maintenanceTasks: [],
    poolNotes: [],
  };
}
