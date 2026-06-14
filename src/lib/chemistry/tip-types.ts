export type ChemistryTip = {
  id: string;
  title: string;
  body: string;
  variant: "info" | "warning";
  sortOrder: number;
  delayAfterPreviousMinutes: number;
  actionable: boolean;
};

export function createTip(
  tip: Omit<ChemistryTip, "sortOrder" | "delayAfterPreviousMinutes" | "actionable"> & {
    sortOrder?: number;
    delayAfterPreviousMinutes?: number;
    actionable?: boolean;
  },
): ChemistryTip {
  return {
    sortOrder: tip.sortOrder ?? 0,
    delayAfterPreviousMinutes: tip.delayAfterPreviousMinutes ?? 0,
    actionable: tip.actionable ?? true,
    id: tip.id,
    title: tip.title,
    body: tip.body,
    variant: tip.variant,
  };
}

export function assignTipSequence(tips: ChemistryTip[]): ChemistryTip[] {
  return tips.map((tip, index) => ({
    ...tip,
    sortOrder: index + 1,
    delayAfterPreviousMinutes: index === 0 ? 0 : tip.delayAfterPreviousMinutes,
  }));
}

export function dedupeAndCapTips(tips: ChemistryTip[], max: number): ChemistryTip[] {
  const seen = new Set<string>();
  const result: ChemistryTip[] = [];

  for (const tip of tips) {
    if (seen.has(tip.id)) continue;
    seen.add(tip.id);
    result.push(tip);
    if (result.length >= max) break;
  }

  return assignTipSequence(result);
}
