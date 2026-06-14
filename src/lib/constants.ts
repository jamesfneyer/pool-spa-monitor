import type { ChemicalType, EquipmentCategory } from "@/lib/data/types";

export const CHEMICAL_TYPE_LABELS: Record<ChemicalType, string> = {
  liquid_chlorine: "Liquid chlorine",
  muriatic_acid: "Muriatic acid",
  baking_soda: "Baking soda",
  calcium_chloride: "Calcium chloride",
  cyanuric_acid: "Cyanuric acid / stabilizer",
  salt: "Salt",
  phosphate_remover: "Phosphate remover",
  clarifier: "Clarifier",
  shock: "Shock",
  other: "Other",
};

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  pump: "Pump",
  filter: "Filter",
  heater: "Heater",
  salt_cell: "Salt cell",
  robot_cleaner: "Robot cleaner",
  automation: "Automation",
  spa: "Spa",
  other: "Other",
};

export const MAINTENANCE_PRESETS = [
  "Clean pump basket",
  "Clean skimmer baskets",
  "Clean filter cartridges",
  "Backwash filter",
  "Inspect salt cell",
  "Test water",
  "Brush pool",
  "Run robot",
  "Drain/refill spa",
  "Clean spa filters",
] as const;
