import type { DataProvider } from "../provider";
import type {
  CreateChemicalDoseInput,
  CreateEquipmentInput,
  CreateMaintenanceTaskInput,
  CreatePoolNoteInput,
  CreatePoolProfileInput,
  CreateWaterTestInput,
  UpdateChemicalDoseInput,
  UpdateEquipmentInput,
  UpdateMaintenanceTaskInput,
  UpdatePoolNoteInput,
  UpdatePoolProfileInput,
  UpdateWaterTestInput,
} from "../types";
import { createSeedData } from "./seed";
import { getMockStore, resetMockStore, setMockStore } from "./store";

function newId(prefix: string): string {
  return `${prefix}-${crypto.randomUUID()}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

let seeded = false;

function ensureSeeded(): void {
  if (!seeded) {
    setMockStore(createSeedData());
    seeded = true;
  }
}

export class MockDataProvider implements DataProvider {
  constructor() {
    ensureSeeded();
  }

  async listPoolProfiles() {
    return [...getMockStore().poolProfiles];
  }

  async getPoolProfile(id: string) {
    return getMockStore().poolProfiles.find((p) => p.id === id) ?? null;
  }

  async createPoolProfile(input: CreatePoolProfileInput) {
    const ts = nowIso();
    const profile = { id: newId("profile"), ...input, createdAt: ts, updatedAt: ts };
    const store = getMockStore();
    store.poolProfiles.push(profile);
    return profile;
  }

  async updatePoolProfile(id: string, input: UpdatePoolProfileInput) {
    const store = getMockStore();
    const index = store.poolProfiles.findIndex((p) => p.id === id);
    if (index === -1) throw new Error(`PoolProfile not found: ${id}`);
    const updated = {
      ...store.poolProfiles[index],
      ...input,
      updatedAt: nowIso(),
    };
    store.poolProfiles[index] = updated;
    return updated;
  }

  async deletePoolProfile(id: string) {
    const store = getMockStore();
    store.poolProfiles = store.poolProfiles.filter((p) => p.id !== id);
  }

  async listWaterTests(poolProfileId?: string) {
    const tests = getMockStore().waterTests;
    return poolProfileId
      ? tests.filter((t) => t.poolProfileId === poolProfileId)
      : [...tests];
  }

  async getWaterTest(id: string) {
    return getMockStore().waterTests.find((t) => t.id === id) ?? null;
  }

  async createWaterTest(input: CreateWaterTestInput) {
    const ts = nowIso();
    const test = { id: newId("test"), ...input, createdAt: ts, updatedAt: ts };
    getMockStore().waterTests.push(test);
    return test;
  }

  async updateWaterTest(id: string, input: UpdateWaterTestInput) {
    const store = getMockStore();
    const index = store.waterTests.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`WaterTest not found: ${id}`);
    const updated = { ...store.waterTests[index], ...input, updatedAt: nowIso() };
    store.waterTests[index] = updated;
    return updated;
  }

  async deleteWaterTest(id: string) {
    const store = getMockStore();
    store.waterTests = store.waterTests.filter((t) => t.id !== id);
  }

  async listChemicalDoses(poolProfileId?: string) {
    const doses = getMockStore().chemicalDoses;
    return poolProfileId
      ? doses.filter((d) => d.poolProfileId === poolProfileId)
      : [...doses];
  }

  async getChemicalDose(id: string) {
    return getMockStore().chemicalDoses.find((d) => d.id === id) ?? null;
  }

  async createChemicalDose(input: CreateChemicalDoseInput) {
    const ts = nowIso();
    const dose = { id: newId("dose"), ...input, createdAt: ts, updatedAt: ts };
    getMockStore().chemicalDoses.push(dose);
    return dose;
  }

  async updateChemicalDose(id: string, input: UpdateChemicalDoseInput) {
    const store = getMockStore();
    const index = store.chemicalDoses.findIndex((d) => d.id === id);
    if (index === -1) throw new Error(`ChemicalDose not found: ${id}`);
    const updated = {
      ...store.chemicalDoses[index],
      ...input,
      updatedAt: nowIso(),
    };
    store.chemicalDoses[index] = updated;
    return updated;
  }

  async deleteChemicalDose(id: string) {
    const store = getMockStore();
    store.chemicalDoses = store.chemicalDoses.filter((d) => d.id !== id);
  }

  async listEquipment(poolProfileId?: string) {
    const items = getMockStore().equipment;
    return poolProfileId
      ? items.filter((e) => e.poolProfileId === poolProfileId)
      : [...items];
  }

  async getEquipment(id: string) {
    return getMockStore().equipment.find((e) => e.id === id) ?? null;
  }

  async createEquipment(input: CreateEquipmentInput) {
    const ts = nowIso();
    const item = { id: newId("equip"), ...input, createdAt: ts, updatedAt: ts };
    getMockStore().equipment.push(item);
    return item;
  }

  async updateEquipment(id: string, input: UpdateEquipmentInput) {
    const store = getMockStore();
    const index = store.equipment.findIndex((e) => e.id === id);
    if (index === -1) throw new Error(`Equipment not found: ${id}`);
    const updated = { ...store.equipment[index], ...input, updatedAt: nowIso() };
    store.equipment[index] = updated;
    return updated;
  }

  async deleteEquipment(id: string) {
    const store = getMockStore();
    store.equipment = store.equipment.filter((e) => e.id !== id);
  }

  async listMaintenanceTasks(poolProfileId?: string) {
    const tasks = getMockStore().maintenanceTasks;
    return poolProfileId
      ? tasks.filter((t) => t.poolProfileId === poolProfileId)
      : [...tasks];
  }

  async getMaintenanceTask(id: string) {
    return getMockStore().maintenanceTasks.find((t) => t.id === id) ?? null;
  }

  async createMaintenanceTask(input: CreateMaintenanceTaskInput) {
    const ts = nowIso();
    const task = { id: newId("task"), ...input, createdAt: ts, updatedAt: ts };
    getMockStore().maintenanceTasks.push(task);
    return task;
  }

  async updateMaintenanceTask(id: string, input: UpdateMaintenanceTaskInput) {
    const store = getMockStore();
    const index = store.maintenanceTasks.findIndex((t) => t.id === id);
    if (index === -1) throw new Error(`MaintenanceTask not found: ${id}`);
    const updated = {
      ...store.maintenanceTasks[index],
      ...input,
      updatedAt: nowIso(),
    };
    store.maintenanceTasks[index] = updated;
    return updated;
  }

  async deleteMaintenanceTask(id: string) {
    const store = getMockStore();
    store.maintenanceTasks = store.maintenanceTasks.filter((t) => t.id !== id);
  }

  async listPoolNotes(poolProfileId?: string) {
    const notes = getMockStore().poolNotes;
    return poolProfileId
      ? notes.filter((n) => n.poolProfileId === poolProfileId)
      : [...notes];
  }

  async getPoolNote(id: string) {
    return getMockStore().poolNotes.find((n) => n.id === id) ?? null;
  }

  async createPoolNote(input: CreatePoolNoteInput) {
    const ts = nowIso();
    const note = { id: newId("note"), ...input, createdAt: ts, updatedAt: ts };
    getMockStore().poolNotes.push(note);
    return note;
  }

  async updatePoolNote(id: string, input: UpdatePoolNoteInput) {
    const store = getMockStore();
    const index = store.poolNotes.findIndex((n) => n.id === id);
    if (index === -1) throw new Error(`PoolNote not found: ${id}`);
    const updated = { ...store.poolNotes[index], ...input, updatedAt: nowIso() };
    store.poolNotes[index] = updated;
    return updated;
  }

  async deletePoolNote(id: string) {
    const store = getMockStore();
    store.poolNotes = store.poolNotes.filter((n) => n.id !== id);
  }
}

export function resetMockDataProvider(): void {
  resetMockStore();
  seeded = false;
}
