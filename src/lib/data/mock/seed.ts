import { addDays, subDays } from "date-fns";
import { DEFAULT_POOL_TARGETS, DEFAULT_SPA_TARGETS } from "@/lib/chemistry/ranges";
import type { MockStore } from "./store";

const now = new Date().toISOString();

export function createSeedData(): MockStore {
  const poolId = "profile-pool-1";
  const spaId = "profile-spa-1";

  const poolProfile = {
    id: poolId,
    name: "Main Pool",
    type: "pool" as const,
    gallons: 18000,
    surfaceType: "Fiberglass",
    sanitizerType: "Salt chlorine generator",
    targetFreeChlorineMin: DEFAULT_POOL_TARGETS.freeChlorine.min,
    targetFreeChlorineMax: DEFAULT_POOL_TARGETS.freeChlorine.max,
    targetPHMin: DEFAULT_POOL_TARGETS.pH.min,
    targetPHMax: DEFAULT_POOL_TARGETS.pH.max,
    targetAlkalinityMin: DEFAULT_POOL_TARGETS.alkalinity.min,
    targetAlkalinityMax: DEFAULT_POOL_TARGETS.alkalinity.max,
    targetCyaMin: DEFAULT_POOL_TARGETS.cya.min,
    targetCyaMax: DEFAULT_POOL_TARGETS.cya.max,
    targetSaltMin: DEFAULT_POOL_TARGETS.salt.min,
    targetSaltMax: DEFAULT_POOL_TARGETS.salt.max,
    createdAt: now,
    updatedAt: now,
  };

  const spaProfile = {
    id: spaId,
    name: "Attached Spa",
    type: "spa" as const,
    gallons: 500,
    surfaceType: "Acrylic",
    sanitizerType: "Salt chlorine generator",
    targetFreeChlorineMin: DEFAULT_SPA_TARGETS.freeChlorine.min,
    targetFreeChlorineMax: DEFAULT_SPA_TARGETS.freeChlorine.max,
    targetPHMin: DEFAULT_SPA_TARGETS.pH.min,
    targetPHMax: DEFAULT_SPA_TARGETS.pH.max,
    targetAlkalinityMin: DEFAULT_SPA_TARGETS.alkalinity.min,
    targetAlkalinityMax: DEFAULT_SPA_TARGETS.alkalinity.max,
    targetCyaMin: DEFAULT_SPA_TARGETS.cya.min,
    targetCyaMax: DEFAULT_SPA_TARGETS.cya.max,
    targetSaltMin: DEFAULT_SPA_TARGETS.salt.min,
    targetSaltMax: DEFAULT_SPA_TARGETS.salt.max,
    createdAt: now,
    updatedAt: now,
  };

  return {
    poolProfiles: [poolProfile, spaProfile],
    waterTests: [
      {
        id: "test-pool-1",
        poolProfileId: poolId,
        testedAt: subDays(new Date(), 1).toISOString(),
        freeChlorine: 2.8,
        totalChlorine: 3.0,
        pH: 7.5,
        alkalinity: 95,
        calciumHardness: 250,
        cya: 40,
        salt: 3200,
        phosphates: 100,
        waterTemp: 82,
        notes: "Water looks clear.",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "test-spa-1",
        poolProfileId: spaId,
        testedAt: subDays(new Date(), 2).toISOString(),
        freeChlorine: 4.2,
        pH: 7.4,
        alkalinity: 90,
        waterTemp: 102,
        createdAt: now,
        updatedAt: now,
      },
    ],
    chemicalDoses: [
      {
        id: "dose-1",
        poolProfileId: poolId,
        waterTestId: "test-pool-1",
        chemicalType: "muriatic_acid",
        amount: 8,
        unit: "oz",
        reason: "pH slightly high",
        addedAt: subDays(new Date(), 1).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    ],
    equipment: [
      {
        id: "equip-1",
        poolProfileId: poolId,
        name: "Variable Speed Pump",
        category: "pump",
        manufacturer: "Pentair",
        model: "IntelliFlo",
        installedAt: "2022-05-01T00:00:00.000Z",
        warrantyExpiresAt: addDays(new Date(), 120).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "equip-2",
        poolProfileId: poolId,
        name: "Cartridge Filter",
        category: "filter",
        manufacturer: "Hayward",
        installedAt: "2022-05-01T00:00:00.000Z",
        warrantyExpiresAt: subDays(new Date(), 30).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    ],
    maintenanceTasks: [
      {
        id: "task-1",
        poolProfileId: poolId,
        title: "Clean pump basket",
        category: "Routine",
        status: "pending",
        dueDate: addDays(new Date(), 2).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: "task-2",
        poolProfileId: poolId,
        title: "Test water",
        category: "Chemistry",
        status: "pending",
        dueDate: subDays(new Date(), 1).toISOString(),
        createdAt: now,
        updatedAt: now,
      },
    ],
    poolNotes: [
      {
        id: "note-1",
        poolProfileId: poolId,
        title: "Winter cover installed",
        body: "Installed mesh safety cover. Reduced pump runtime to 4h/day.",
        category: "Seasonal",
        createdAt: now,
        updatedAt: now,
      },
    ],
  };
}
