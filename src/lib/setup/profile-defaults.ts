import { DEFAULT_POOL_TARGETS, DEFAULT_SPA_TARGETS } from "@/lib/chemistry/ranges";
import type { CreatePoolProfileInput, PoolType } from "@/lib/data/types";

export function defaultTargets(type: PoolType) {
  const t = type === "spa" ? DEFAULT_SPA_TARGETS : DEFAULT_POOL_TARGETS;
  return {
    targetFreeChlorineMin: t.freeChlorine.min,
    targetFreeChlorineMax: t.freeChlorine.max,
    targetPHMin: t.pH.min,
    targetPHMax: t.pH.max,
    targetAlkalinityMin: t.alkalinity.min,
    targetAlkalinityMax: t.alkalinity.max,
    targetCyaMin: t.cya.min,
    targetCyaMax: t.cya.max,
    targetSaltMin: t.salt.min,
    targetSaltMax: t.salt.max,
  };
}

export function defaultProfileFields(type: PoolType) {
  return {
    name: type === "spa" ? "Attached Spa" : "Main Pool",
    type,
    gallons: type === "spa" ? 500 : 18000,
    surfaceType: type === "spa" ? "Acrylic" : "Fiberglass",
    sanitizerType: "Salt chlorine generator",
    ...defaultTargets(type),
  };
}

export function buildCreatePoolProfileInput(
  type: PoolType,
  fields: {
    name: string;
    gallons: number;
    surfaceType: string;
    sanitizerType: string;
  },
): CreatePoolProfileInput {
  return {
    type,
    ...fields,
    ...defaultTargets(type),
  };
}

export const SURFACE_TYPE_OPTIONS = ["Fiberglass", "Plaster", "Vinyl", "Acrylic", "Other"] as const;

export const SANITIZER_TYPE_OPTIONS = [
  "Salt chlorine generator",
  "Liquid chlorine",
  "Bromine",
  "Mineral",
  "Other",
] as const;
