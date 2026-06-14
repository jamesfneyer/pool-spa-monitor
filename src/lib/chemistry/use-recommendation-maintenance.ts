"use client";

import { useCallback, useEffect, useState } from "react";
import {
  buildMaintenanceTaskFromTip,
  isTipAlreadyAdded,
} from "@/lib/chemistry/tip-to-maintenance";
import type { ChemistryTip } from "@/lib/chemistry/tip-types";
import { useDataProvider } from "@/lib/data/hooks";

export function useRecommendationMaintenance(
  recommendationGroupId: string | null,
  poolProfileId: string | null,
) {
  const provider = useDataProvider();
  const [addedTipIds, setAddedTipIds] = useState<string[]>([]);
  const [addingTipId, setAddingTipId] = useState<string | null>(null);

  const refreshAddedTips = useCallback(async () => {
    if (!recommendationGroupId) {
      setAddedTipIds([]);
      return;
    }
    const tasks = await provider.listMaintenanceTasks(poolProfileId ?? undefined);
    const ids = tasks
      .filter(
        (task) =>
          task.status === "pending" &&
          task.recommendationGroupId === recommendationGroupId &&
          task.sourceTipId,
      )
      .map((task) => task.sourceTipId as string);
    setAddedTipIds(ids);
  }, [provider, recommendationGroupId, poolProfileId]);

  useEffect(() => {
    void refreshAddedTips();
  }, [refreshAddedTips]);

  const handleAddToMaintenance = useCallback(
    async (tip: ChemistryTip, allTips: ChemistryTip[]) => {
      if (!recommendationGroupId || !poolProfileId) return;

      const tasks = await provider.listMaintenanceTasks(poolProfileId);
      if (isTipAlreadyAdded(tasks, recommendationGroupId, tip.id)) {
        setAddedTipIds((prev) =>
          prev.includes(tip.id) ? prev : [...prev, tip.id],
        );
        return;
      }

      setAddingTipId(tip.id);
      try {
        await provider.createMaintenanceTask(
          buildMaintenanceTaskFromTip({
            tip,
            tips: allTips,
            poolProfileId,
            recommendationGroupId,
          }),
        );
        setAddedTipIds((prev) => [...prev, tip.id]);
      } finally {
        setAddingTipId(null);
      }
    },
    [provider, recommendationGroupId, poolProfileId],
  );

  return {
    addedTipIds,
    addingTipId,
    handleAddToMaintenance,
    refreshAddedTips,
  };
}
