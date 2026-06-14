import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { EquipmentCategory, PoolType } from "@/lib/data/types";

export interface EquipmentPreset {
  category: EquipmentCategory;
  defaultName: string;
  label: string;
}

const POOL_EQUIPMENT_PRESETS: EquipmentPreset[] = [
  { category: "pump", defaultName: "Variable Speed Pump", label: EQUIPMENT_CATEGORY_LABELS.pump },
  { category: "filter", defaultName: "Cartridge Filter", label: EQUIPMENT_CATEGORY_LABELS.filter },
  { category: "heater", defaultName: "Pool Heater", label: EQUIPMENT_CATEGORY_LABELS.heater },
  { category: "salt_cell", defaultName: "Salt Cell", label: EQUIPMENT_CATEGORY_LABELS.salt_cell },
  {
    category: "robot_cleaner",
    defaultName: "Robot Cleaner",
    label: EQUIPMENT_CATEGORY_LABELS.robot_cleaner,
  },
  {
    category: "automation",
    defaultName: "Automation Panel",
    label: EQUIPMENT_CATEGORY_LABELS.automation,
  },
];

const SPA_EQUIPMENT_PRESETS: EquipmentPreset[] = [
  { category: "pump", defaultName: "Circulation Pump", label: EQUIPMENT_CATEGORY_LABELS.pump },
  { category: "filter", defaultName: "Spa Filter", label: EQUIPMENT_CATEGORY_LABELS.filter },
  { category: "heater", defaultName: "Spa Heater", label: EQUIPMENT_CATEGORY_LABELS.heater },
  {
    category: "automation",
    defaultName: "Spa Control",
    label: EQUIPMENT_CATEGORY_LABELS.automation,
  },
];

export function getEquipmentPresetsForType(type: PoolType): EquipmentPreset[] {
  return type === "spa" ? SPA_EQUIPMENT_PRESETS : POOL_EQUIPMENT_PRESETS;
}

export interface EquipmentSelection {
  category: EquipmentCategory;
  enabled: boolean;
  name: string;
  manufacturer: string;
  model: string;
}

export function createDefaultEquipmentSelections(type: PoolType): EquipmentSelection[] {
  return getEquipmentPresetsForType(type).map((preset) => ({
    category: preset.category,
    enabled: false,
    name: preset.defaultName,
    manufacturer: "",
    model: "",
  }));
}
