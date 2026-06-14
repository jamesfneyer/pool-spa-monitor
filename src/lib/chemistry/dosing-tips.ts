import type { ChemicalType, PoolProfile, WaterTest } from "@/lib/data/types";
import { getChemistryStatus } from "@/lib/chemistry/status";
import {
  createTip,
  dedupeAndCapTips,
  type ChemistryTip,
} from "@/lib/chemistry/tip-types";

export type DosingTip = ChemistryTip;

export type DosingTipsInput = {
  chemicalType: ChemicalType;
  amount: number;
  unit: string;
  poolProfile: PoolProfile;
  waterTest?: WaterTest | null;
};

const MAX_TIPS = 5;

function baselineTips(
  chemicalType: ChemicalType,
  isSpa: boolean,
): ChemistryTip[] {
  const phRetest = isSpa ? "2–4 hours" : "4–6 hours";
  const fcRetest = isSpa ? "4–6 hours" : "24 hours";
  const alkRetest = isSpa ? "6–12 hours" : "24 hours";
  const retestFcDelay = isSpa ? 360 : 1440;
  const retestPhDelay = isSpa ? 180 : 300;
  const retestAlkDelay = isSpa ? 720 : 1440;
  const retestChDelay = isSpa ? 1440 : 2880;
  const retestSaltDelay = isSpa ? 720 : 1440;

  const tips: Record<ChemicalType, ChemistryTip[]> = {
    liquid_chlorine: [
      createTip({
        id: "circulate",
        title: "Run the pump",
        body: "Circulate water for 30–60 minutes so the chlorine disperses evenly.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "swim-wait",
        title: "Wait before swimming",
        body: "Avoid swimming until free chlorine drops into your target range.",
        variant: "info",
        delayAfterPreviousMinutes: 60,
      }),
      createTip({
        id: "retest-fc",
        title: "Retest free chlorine",
        body: `Check free chlorine again in ${fcRetest}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestFcDelay,
      }),
    ],
    shock: [
      createTip({
        id: "circulate",
        title: "Run the pump",
        body: "Keep the pump running for at least 1 hour to distribute the shock.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "swim-wait",
        title: "Wait before swimming",
        body: "Do not swim until free chlorine falls back into your target range — often 24 hours after shocking.",
        variant: "warning",
        delayAfterPreviousMinutes: 60,
      }),
      createTip({
        id: "retest-fc",
        title: "Retest free chlorine",
        body: `Check free chlorine again in ${isSpa ? "6–12 hours" : "24 hours"}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestFcDelay,
      }),
    ],
    muriatic_acid: [
      createTip({
        id: "circulate",
        title: "Circulate the water",
        body: "Run the pump for 30–60 minutes after adding acid.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "no-mix",
        title: "Do not mix chemicals",
        body: "Never add acid with chlorine, shock, or other chemicals in the same spot.",
        variant: "warning",
        delayAfterPreviousMinutes: 0,
        actionable: false,
      }),
      createTip({
        id: "retest-ph",
        title: "Retest pH",
        body: `Check pH again in ${phRetest}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestPhDelay,
      }),
    ],
    baking_soda: [
      createTip({
        id: "dissolve",
        title: "Dissolve and broadcast",
        body: "Pre-dissolve in a bucket of pool water, then pour around the perimeter with the pump running.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "retest-alk",
        title: "Retest alkalinity",
        body: `Check total alkalinity again in ${alkRetest}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestAlkDelay,
      }),
    ],
    calcium_chloride: [
      createTip({
        id: "predissolve",
        title: "Pre-dissolve before adding",
        body: "Dissolve calcium chloride in a bucket of water before adding — never pour dry granules directly.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "no-acid",
        title: "Never add with acid",
        body: "Do not add calcium chloride at the same time as muriatic acid.",
        variant: "warning",
        delayAfterPreviousMinutes: 0,
        actionable: false,
      }),
      createTip({
        id: "retest-ch",
        title: "Retest calcium hardness",
        body: `Check calcium hardness again in ${isSpa ? "12–24 hours" : "24–48 hours"}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestChDelay,
      }),
    ],
    cyanuric_acid: [
      createTip({
        id: "add-slow",
        title: "Add slowly",
        body: "Use a sock in the skimmer or pre-dissolve in warm water — CYA dissolves slowly.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "retest-cya",
        title: "Retest CYA",
        body: "Cyanuric acid takes time to register — retest in about 1 week.",
        variant: "info",
        delayAfterPreviousMinutes: 10080,
      }),
    ],
    salt: [
      createTip({
        id: "brush",
        title: "Brush to dissolve",
        body: "Brush any salt piles on the floor until fully dissolved to avoid surface damage.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "run-pump",
        title: "Run the pump",
        body: "Keep the pump running until salt is fully dissolved, then check your salt cell reading.",
        variant: "info",
        delayAfterPreviousMinutes: 60,
      }),
      createTip({
        id: "retest-salt",
        title: "Retest salt level",
        body: `Check salt again in ${isSpa ? "12 hours" : "24 hours"}.`,
        variant: "info",
        delayAfterPreviousMinutes: retestSaltDelay,
      }),
    ],
    phosphate_remover: [
      createTip({
        id: "cloudiness",
        title: "Expect temporary cloudiness",
        body: "Phosphate remover can cloud the water briefly — this is normal.",
        variant: "info",
        actionable: false,
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "run-filter",
        title: "Run the filter",
        body: "Keep the filter running and backwash or clean cartridges when pressure rises.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
    ],
    clarifier: [
      createTip({
        id: "run-filter",
        title: "Run the filter continuously",
        body: "Keep the pump and filter running so the clarifier can capture fine particles.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "vacuum",
        title: "Vacuum to waste",
        body: "Vacuum settled debris to waste the next day if the water still looks hazy.",
        variant: "info",
        delayAfterPreviousMinutes: 1440,
      }),
    ],
    other: [
      createTip({
        id: "circulate",
        title: "Circulate the water",
        body: "Run the pump for at least 30 minutes after adding any chemical.",
        variant: "info",
        delayAfterPreviousMinutes: 0,
      }),
      createTip({
        id: "retest-general",
        title: "Log a follow-up test",
        body: "Record a water test after this dose to confirm levels are on track.",
        variant: "info",
        delayAfterPreviousMinutes: 1440,
      }),
    ],
  };

  return tips[chemicalType];
}

function contextualTips(
  chemicalType: ChemicalType,
  poolProfile: PoolProfile,
  waterTest: WaterTest,
): ChemistryTip[] {
  const tips: ChemistryTip[] = [];
  const isSpa = poolProfile.type === "spa";

  const phStatus = getChemistryStatus(
    waterTest.pH,
    poolProfile.targetPHMin,
    poolProfile.targetPHMax,
  );
  const fcStatus = getChemistryStatus(
    waterTest.freeChlorine,
    poolProfile.targetFreeChlorineMin,
    poolProfile.targetFreeChlorineMax,
  );
  const alkStatus = getChemistryStatus(
    waterTest.alkalinity,
    poolProfile.targetAlkalinityMin,
    poolProfile.targetAlkalinityMax,
  );
  const cyaStatus = getChemistryStatus(
    waterTest.cya,
    poolProfile.targetCyaMin,
    poolProfile.targetCyaMax,
  );
  const saltStatus = getChemistryStatus(
    waterTest.salt,
    poolProfile.targetSaltMin,
    poolProfile.targetSaltMax,
  );

  if (chemicalType === "muriatic_acid") {
    if (phStatus === "high") {
      tips.push(
        createTip({
          id: "context-ph-high-affirm",
          title: "Matches your test results",
          body: "Your linked test showed high pH — this acid dose should help. Retest after circulation.",
          variant: "info",
          actionable: false,
        }),
      );
    } else if (phStatus === "low") {
      tips.push(
        createTip({
          id: "context-ph-low-warn",
          title: "pH was already low",
          body: "Your linked test showed low pH. Adding more acid may drop it further — retest soon.",
          variant: "warning",
          actionable: false,
        }),
      );
    }
  }

  if (chemicalType === "baking_soda" && alkStatus === "low") {
    tips.push(
      createTip({
        id: "context-alk-low-affirm",
        title: "Matches your test results",
        body: "Your linked test showed low alkalinity — this dose should help bring it up.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  if (
    (chemicalType === "liquid_chlorine" || chemicalType === "shock") &&
    fcStatus === "low"
  ) {
    tips.push(
      createTip({
        id: "context-fc-low-affirm",
        title: "Matches your test results",
        body: "Your linked test showed low free chlorine — monitor levels as this dose takes effect.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  if (chemicalType === "cyanuric_acid" && cyaStatus === "low") {
    tips.push(
      createTip({
        id: "context-cya-low-affirm",
        title: "Matches your test results",
        body: "Your linked test showed low CYA — stabilizer takes time to register, so retest in about a week.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  if (chemicalType === "salt" && saltStatus === "low") {
    tips.push(
      createTip({
        id: "context-salt-low-affirm",
        title: "Matches your test results",
        body: "Your linked test showed low salt — confirm the level once fully dissolved.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  if (chemicalType === "calcium_chloride" && waterTest.calciumHardness != null) {
    tips.push(
      createTip({
        id: "context-ch-affirm",
        title: "Hardness adjustment logged",
        body: "Retest calcium hardness after this dose has circulated fully.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  if (isSpa && tips.length > 0) {
    tips.push(
      createTip({
        id: "context-spa-fast",
        title: "Spa chemistry shifts quickly",
        body: "Smaller water volume means changes happen faster — retest on the shorter end of the suggested window.",
        variant: "info",
        actionable: false,
      }),
    );
  }

  return tips;
}

function noWaterTestTip(): ChemistryTip {
  return createTip({
    id: "no-water-test",
    title: "Log a follow-up water test",
    body: "Consider logging a water test after this dose to confirm levels are where you want them.",
    variant: "info",
    delayAfterPreviousMinutes: 1440,
  });
}

export function getDosingTips(input: DosingTipsInput): ChemistryTip[] {
  const isSpa = input.poolProfile.type === "spa";
  const tips: ChemistryTip[] = [
    ...baselineTips(input.chemicalType, isSpa),
    ...(input.waterTest
      ? contextualTips(input.chemicalType, input.poolProfile, input.waterTest)
      : [noWaterTestTip()]),
  ];

  return dedupeAndCapTips(tips, MAX_TIPS);
}
