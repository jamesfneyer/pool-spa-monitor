export type ChemistryStatus = "low" | "in_range" | "high" | "missing";

export function getChemistryStatus(
  value: number | null | undefined,
  min: number,
  max: number,
): ChemistryStatus {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "missing";
  }
  if (value < min) return "low";
  if (value > max) return "high";
  return "in_range";
}

export const chemistryStatusLabels: Record<ChemistryStatus, string> = {
  low: "Low",
  in_range: "In range",
  high: "High",
  missing: "Missing",
};
