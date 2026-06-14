import { NextResponse } from "next/server";
import { getActiveDataModeInfo, getDataProvider } from "@/lib/data/factory";

export async function GET() {
  const provider = getDataProvider();
  const profiles = await provider.listPoolProfiles();
  const modeInfo = getActiveDataModeInfo();

  return NextResponse.json({
    status: "ok",
    dataMode: modeInfo.mode,
    provider: modeInfo.provider,
    persistence: modeInfo.persistence,
    description: modeInfo.description,
    localstackFallback: modeInfo.localstackFallback,
    poolProfileCount: profiles.length,
    maintenanceTaskCount: (await provider.listMaintenanceTasks()).length,
    poolProfiles: profiles.map((p) => ({ id: p.id, name: p.name, type: p.type })),
  });
}
