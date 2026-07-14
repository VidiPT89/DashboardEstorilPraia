import { prisma } from "@/lib/prisma";
import type { PhysicalMetrics } from "@/lib/simulated/wearables";

export const WEARABLE_SUMMARY_TYPE = "wearable_summary";

export interface PlayerPhysicalData {
  playerId: string;
  playerName: string;
  shirtNumber: number | null;
  position: string | null;
  metrics: PhysicalMetrics;
}

export async function getSimulatedPhysicalData(): Promise<PlayerPhysicalData[]> {
  const rows = await prisma.simulatedMetric.findMany({
    where: { type: WEARABLE_SUMMARY_TYPE, playerId: { not: null } },
    include: { player: true },
  });

  return rows
    .filter((row) => row.player !== null)
    .map((row) => ({
      playerId: row.player!.id,
      playerName: row.player!.name,
      shirtNumber: row.player!.shirtNumber,
      position: row.player!.position,
      metrics: row.value as unknown as PhysicalMetrics,
    }))
    .sort((a, b) => (a.shirtNumber ?? 99) - (b.shirtNumber ?? 99));
}
