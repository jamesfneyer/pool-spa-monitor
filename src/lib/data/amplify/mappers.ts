import type {
  ChemicalDose,
  Equipment,
  MaintenanceTask,
  PoolNote,
  PoolProfile,
  WaterTest,
} from "../types";

function toIso(value: string | null | undefined): string {
  return value ?? new Date().toISOString();
}

export function mapPoolProfile(item: Record<string, unknown>): PoolProfile {
  return {
    id: String(item.id),
    name: String(item.name),
    type: item.type as PoolProfile["type"],
    gallons: Number(item.gallons),
    surfaceType: String(item.surfaceType ?? ""),
    sanitizerType: String(item.sanitizerType ?? ""),
    targetFreeChlorineMin: Number(item.targetFreeChlorineMin ?? 0),
    targetFreeChlorineMax: Number(item.targetFreeChlorineMax ?? 0),
    targetPHMin: Number(item.targetPHMin ?? 0),
    targetPHMax: Number(item.targetPHMax ?? 0),
    targetAlkalinityMin: Number(item.targetAlkalinityMin ?? 0),
    targetAlkalinityMax: Number(item.targetAlkalinityMax ?? 0),
    targetCyaMin: Number(item.targetCyaMin ?? 0),
    targetCyaMax: Number(item.targetCyaMax ?? 0),
    targetSaltMin: Number(item.targetSaltMin ?? 0),
    targetSaltMax: Number(item.targetSaltMax ?? 0),
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}

export function mapWaterTest(item: Record<string, unknown>): WaterTest {
  return {
    id: String(item.id),
    poolProfileId: String(item.poolProfileId),
    testedAt: toIso(item.testedAt as string),
    freeChlorine: item.freeChlorine != null ? Number(item.freeChlorine) : null,
    totalChlorine:
      item.totalChlorine != null ? Number(item.totalChlorine) : null,
    pH: item.pH != null ? Number(item.pH) : null,
    alkalinity: item.alkalinity != null ? Number(item.alkalinity) : null,
    calciumHardness:
      item.calciumHardness != null ? Number(item.calciumHardness) : null,
    cya: item.cya != null ? Number(item.cya) : null,
    salt: item.salt != null ? Number(item.salt) : null,
    phosphates: item.phosphates != null ? Number(item.phosphates) : null,
    waterTemp: item.waterTemp != null ? Number(item.waterTemp) : null,
    notes: (item.notes as string) ?? null,
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}

export function mapChemicalDose(item: Record<string, unknown>): ChemicalDose {
  return {
    id: String(item.id),
    poolProfileId: String(item.poolProfileId),
    waterTestId: (item.waterTestId as string) ?? null,
    chemicalType: item.chemicalType as ChemicalDose["chemicalType"],
    amount: Number(item.amount),
    unit: String(item.unit),
    reason: (item.reason as string) ?? null,
    addedAt: toIso(item.addedAt as string),
    notes: (item.notes as string) ?? null,
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}

export function mapEquipment(item: Record<string, unknown>): Equipment {
  return {
    id: String(item.id),
    poolProfileId: String(item.poolProfileId),
    name: String(item.name),
    category: item.category as Equipment["category"],
    manufacturer: (item.manufacturer as string) ?? null,
    model: (item.model as string) ?? null,
    serialNumber: (item.serialNumber as string) ?? null,
    installedAt: (item.installedAt as string) ?? null,
    warrantyExpiresAt: (item.warrantyExpiresAt as string) ?? null,
    notes: (item.notes as string) ?? null,
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}

export function mapMaintenanceTask(item: Record<string, unknown>): MaintenanceTask {
  return {
    id: String(item.id),
    poolProfileId: String(item.poolProfileId),
    title: String(item.title),
    category: String(item.category ?? ""),
    status: item.status as MaintenanceTask["status"],
    dueDate: toIso(item.dueDate as string),
    completedAt: (item.completedAt as string) ?? null,
    recurrence: (item.recurrence as string) ?? null,
    notes: (item.notes as string) ?? null,
    recommendationGroupId: (item.recommendationGroupId as string) ?? null,
    sourceTipId: (item.sourceTipId as string) ?? null,
    sequenceOrder:
      item.sequenceOrder != null ? Number(item.sequenceOrder) : null,
    delayAfterPreviousMinutes:
      item.delayAfterPreviousMinutes != null
        ? Number(item.delayAfterPreviousMinutes)
        : null,
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}

export function mapPoolNote(item: Record<string, unknown>): PoolNote {
  return {
    id: String(item.id),
    poolProfileId: String(item.poolProfileId),
    title: String(item.title),
    body: String(item.body),
    category: String(item.category ?? ""),
    createdAt: toIso(item.createdAt as string),
    updatedAt: toIso(item.updatedAt as string),
  };
}
