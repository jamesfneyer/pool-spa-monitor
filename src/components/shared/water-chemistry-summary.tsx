import { StatusBadge } from "@/components/shared/status-badge";
import { getChemistryStatus } from "@/lib/chemistry/status";
import type { PoolProfile, WaterTest } from "@/lib/data/types";

interface WaterChemistrySummaryProps {
  profile: PoolProfile;
  test: WaterTest | null;
}

export function WaterChemistrySummary({
  profile,
  test,
}: WaterChemistrySummaryProps) {
  if (!test) {
    return <p className="text-sm text-muted-foreground">No tests recorded yet.</p>;
  }

  const metrics = [
    {
      label: "Free chlorine",
      value: test.freeChlorine,
      status: getChemistryStatus(
        test.freeChlorine,
        profile.targetFreeChlorineMin,
        profile.targetFreeChlorineMax,
      ),
      display:
        test.freeChlorine != null ? `${test.freeChlorine} ppm` : "—",
    },
    {
      label: "pH",
      value: test.pH,
      status: getChemistryStatus(test.pH, profile.targetPHMin, profile.targetPHMax),
      display: test.pH != null ? String(test.pH) : "—",
    },
    {
      label: "Alkalinity",
      value: test.alkalinity,
      status: getChemistryStatus(
        test.alkalinity,
        profile.targetAlkalinityMin,
        profile.targetAlkalinityMax,
      ),
      display: test.alkalinity != null ? `${test.alkalinity} ppm` : "—",
    },
    {
      label: "CYA",
      value: test.cya,
      status: getChemistryStatus(test.cya, profile.targetCyaMin, profile.targetCyaMax),
      display: test.cya != null ? `${test.cya} ppm` : "—",
    },
    {
      label: "Salt",
      value: test.salt,
      status: getChemistryStatus(test.salt, profile.targetSaltMin, profile.targetSaltMax),
      display: test.salt != null ? `${test.salt} ppm` : "—",
    },
  ];

  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className="flex items-center justify-between rounded-lg border bg-card px-3 py-2"
        >
          <div>
            <dt className="text-xs text-muted-foreground">{metric.label}</dt>
            <dd className="font-medium">{metric.display}</dd>
          </div>
          <StatusBadge status={metric.status} />
        </div>
      ))}
    </dl>
  );
}
