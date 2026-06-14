import type { EquipmentCategory } from "@/lib/data/types";

export const MANUFACTURER_OTHER = "Other" as const;

const WITH_OTHER = (brands: readonly string[]) => [...brands, MANUFACTURER_OTHER] as const;

export const EQUIPMENT_MANUFACTURERS: Record<EquipmentCategory, readonly string[]> = {
  pump: WITH_OTHER(["Pentair", "Hayward", "Jandy", "Sta-Rite", "Speck"]),
  filter: WITH_OTHER(["Hayward", "Pentair", "Jandy", "Waterway", "Sta-Rite"]),
  heater: WITH_OTHER(["Pentair", "Hayward", "Raypak", "Jandy", "AquaCal"]),
  salt_cell: WITH_OTHER(["Pentair", "Hayward", "Jandy", "CircuPool"]),
  robot_cleaner: WITH_OTHER(["Maytronics", "Polaris", "Hayward", "Pentair"]),
  automation: WITH_OTHER(["Pentair", "Hayward", "Jandy", "Intermatic"]),
  spa: WITH_OTHER([
    "Hot Spring",
    "Sundance",
    "Jacuzzi",
    "Bullfrog",
    "Master Spas",
    "Caldera",
  ]),
  other: WITH_OTHER(["Pentair", "Hayward", "Jandy"]),
};

export function getManufacturersForCategory(category: EquipmentCategory): readonly string[] {
  return EQUIPMENT_MANUFACTURERS[category];
}

export function isKnownManufacturer(category: EquipmentCategory, value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return getManufacturersForCategory(category).some(
    (brand) => brand !== MANUFACTURER_OTHER && brand === trimmed,
  );
}

export function getManufacturerSelectValue(
  category: EquipmentCategory,
  stored: string,
): string {
  const trimmed = stored.trim();
  if (!trimmed) return "";
  if (isKnownManufacturer(category, trimmed)) return trimmed;
  return MANUFACTURER_OTHER;
}

export function resolveManufacturerForSave(selectValue: string, otherText: string): string {
  if (!selectValue) return "";
  if (selectValue === MANUFACTURER_OTHER) return otherText.trim();
  return selectValue;
}
