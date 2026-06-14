import { getChemistryStatus } from "@/lib/chemistry/status";
import {
  createTip,
  dedupeAndCapTips,
  type ChemistryTip,
} from "@/lib/chemistry/tip-types";
import type { PoolProfile, WaterTest } from "@/lib/data/types";

const MAX_TIPS = 6;

const DELAY = {
  immediate: 0,
  circulate: 60,
  retestPhPool: 300,
  retestPhSpa: 180,
  retestDay: 1440,
  retestWeek: 10080,
  afterAlk: 1440,
} as const;

type TrackedParameter = {
  id: string;
  label: string;
  value: number | null | undefined;
  min: number;
  max: number;
};

function trackedParameters(
  poolProfile: PoolProfile,
  waterTest: WaterTest,
): TrackedParameter[] {
  const params: TrackedParameter[] = [
    {
      id: "freeChlorine",
      label: "free chlorine",
      value: waterTest.freeChlorine,
      min: poolProfile.targetFreeChlorineMin,
      max: poolProfile.targetFreeChlorineMax,
    },
    {
      id: "pH",
      label: "pH",
      value: waterTest.pH,
      min: poolProfile.targetPHMin,
      max: poolProfile.targetPHMax,
    },
    {
      id: "alkalinity",
      label: "alkalinity",
      value: waterTest.alkalinity,
      min: poolProfile.targetAlkalinityMin,
      max: poolProfile.targetAlkalinityMax,
    },
    {
      id: "cya",
      label: "CYA",
      value: waterTest.cya,
      min: poolProfile.targetCyaMin,
      max: poolProfile.targetCyaMax,
    },
  ];

  const tracksSalt =
    poolProfile.targetSaltMax > 0 || poolProfile.targetSaltMin > 0;
  if (tracksSalt) {
    params.push({
      id: "salt",
      label: "salt",
      value: waterTest.salt,
      min: poolProfile.targetSaltMin,
      max: poolProfile.targetSaltMax,
    });
  }

  return params;
}

function tipForParameter(
  param: TrackedParameter,
  status: ReturnType<typeof getChemistryStatus>,
  isSpa: boolean,
  alkOff: boolean,
): ChemistryTip | null {
  const phRetest = isSpa ? "2–4 hours" : "4–6 hours";
  const phDelay = alkOff ? DELAY.afterAlk : DELAY.immediate;

  switch (param.id) {
    case "freeChlorine":
      if (status === "low") {
        return createTip({
          id: "fc-low",
          title: "Raise free chlorine",
          body: "Add liquid chlorine or shock, run the pump 30–60 minutes, then retest.",
          variant: "warning",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      if (status === "high") {
        return createTip({
          id: "fc-high",
          title: "Free chlorine is high",
          body: "Avoid swimming until levels drop into your target range. Sunlight and circulation will help it come down.",
          variant: "warning",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      break;

    case "pH":
      if (status === "low") {
        return createTip({
          id: "ph-low",
          title: "Raise pH",
          body: "Add soda ash or aerate the water. Check alkalinity too — low alkalinity often pulls pH down.",
          variant: "info",
          delayAfterPreviousMinutes: phDelay,
        });
      }
      if (status === "high") {
        return createTip({
          id: "ph-high",
          title: "Lower pH",
          body: `Add muriatic acid in small doses with the pump running. Retest in ${phRetest}.`,
          variant: "warning",
          delayAfterPreviousMinutes: phDelay,
        });
      }
      break;

    case "alkalinity":
      if (status === "low") {
        return createTip({
          id: "alk-low",
          title: "Raise alkalinity",
          body: "Add baking soda (pre-dissolved in a bucket first). Retest alkalinity in 24 hours.",
          variant: "info",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      if (status === "high") {
        return createTip({
          id: "alk-high",
          title: "Lower alkalinity",
          body: "Lower slowly with muriatic acid — alkalinity drops gradually. Retest after 24 hours.",
          variant: "warning",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      break;

    case "cya":
      if (status === "low") {
        return createTip({
          id: "cya-low",
          title: "Add stabilizer",
          body: "Add cyanuric acid slowly via sock or skimmer. Retest in about a week.",
          variant: "info",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      if (status === "high") {
        return createTip({
          id: "cya-high",
          title: "CYA is high",
          body: "High stabilizer is hard to remove — partial drain and refill is the most reliable fix.",
          variant: "warning",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      break;

    case "salt":
      if (status === "low") {
        return createTip({
          id: "salt-low",
          title: "Add salt",
          body: "Add pool salt, brush to dissolve, run the pump, and retest in 24 hours.",
          variant: "info",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      if (status === "high") {
        return createTip({
          id: "salt-high",
          title: "Salt level is high",
          body: "Dilute with fresh water if needed. Very high salt can damage equipment.",
          variant: "warning",
          delayAfterPreviousMinutes: DELAY.immediate,
        });
      }
      break;
  }

  return null;
}

function missingTip(param: TrackedParameter): ChemistryTip {
  return createTip({
    id: `missing-${param.id}`,
    title: `Record ${param.label}`,
    body: `Record ${param.label} next time for more specific guidance.`,
    variant: "info",
    delayAfterPreviousMinutes: DELAY.immediate,
  });
}

function orderingTip(): ChemistryTip {
  return createTip({
    id: "adjust-order",
    title: "Adjust one parameter at a time",
    body: "Adjust alkalinity before pH when both are off. Make one change at a time and retest.",
    variant: "info",
    delayAfterPreviousMinutes: DELAY.immediate,
  });
}

function balancedTip(): ChemistryTip {
  return createTip({
    id: "all-balanced",
    title: "Levels look balanced",
    body: "Key levels look balanced — keep up regular testing.",
    variant: "info",
    actionable: false,
    delayAfterPreviousMinutes: DELAY.immediate,
  });
}

function sortTips(tips: ChemistryTip[]): ChemistryTip[] {
  const priority: Record<string, number> = {
    "adjust-order": 1,
    "alk-low": 2,
    "alk-high": 2,
    "ph-low": 3,
    "ph-high": 3,
    "fc-low": 4,
    "fc-high": 4,
    "cya-low": 5,
    "cya-high": 5,
    "salt-low": 6,
    "salt-high": 6,
  };

  return [...tips].sort((a, b) => {
    const pa = priority[a.id] ?? (a.id.startsWith("missing-") ? 7 : 8);
    const pb = priority[b.id] ?? (b.id.startsWith("missing-") ? 7 : 8);
    return pa - pb;
  });
}

export function getTestRecommendations(
  poolProfile: PoolProfile,
  waterTest: WaterTest,
): ChemistryTip[] {
  const isSpa = poolProfile.type === "spa";
  const params = trackedParameters(poolProfile, waterTest);
  const tips: ChemistryTip[] = [];

  let offCount = 0;
  let alkOff = false;
  let phOff = false;

  for (const param of params) {
    const status = getChemistryStatus(param.value, param.min, param.max);

    if (status === "missing") {
      tips.push(missingTip(param));
      continue;
    }

    if (status !== "in_range") {
      offCount++;
      if (param.id === "alkalinity") alkOff = true;
      if (param.id === "pH") phOff = true;

      const tip = tipForParameter(param, status, isSpa, alkOff && phOff);
      if (tip) tips.push(tip);
    }
  }

  if (offCount === 0 && tips.length === 0) {
    return [balancedTip()];
  }

  if (alkOff && phOff) {
    tips.unshift(orderingTip());
  }

  if (isSpa && offCount > 0) {
    tips.push(
      createTip({
        id: "spa-fast",
        title: "Spa chemistry shifts quickly",
        body: "Smaller water volume means changes happen faster — retest on the shorter end of suggested windows.",
        variant: "info",
        actionable: false,
        delayAfterPreviousMinutes: DELAY.immediate,
      }),
    );
  }

  return dedupeAndCapTips(sortTips(tips), MAX_TIPS);
}
