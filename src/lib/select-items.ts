import type { ReactNode } from "react";
import { EQUIPMENT_CATEGORY_LABELS } from "@/lib/constants";
import type { PoolProfile } from "@/lib/data/types";

export function poolProfileSelectItems(
  profiles: PoolProfile[],
  formatLabel: (profile: PoolProfile) => ReactNode = (p) => p.name,
): Record<string, ReactNode> {
  return Object.fromEntries(profiles.map((p) => [p.id, formatLabel(p)]));
}

export function poolProfileFilterItems(
  profiles: PoolProfile[],
  allLabel = "All profiles",
): Record<string, ReactNode> {
  return { all: allLabel, ...poolProfileSelectItems(profiles) };
}

export const EQUIPMENT_CATEGORY_FILTER_ITEMS = {
  all: "All categories",
  ...EQUIPMENT_CATEGORY_LABELS,
};
