import { prisma } from "@/lib/prisma";
import type { PhysicalMetrics } from "@/lib/simulated/wearables";
import { SUSPENSION_THRESHOLD } from "@/lib/simulated/cards";

export const WEARABLE_SUMMARY_TYPE = "wearable_summary";
export const CARD_ACCUMULATION_TYPE = "card_accumulation";

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

export interface PlayerCardAlert {
  playerId: string;
  playerName: string;
  shirtNumber: number | null;
  yellowCards: number;
  isSuspended: boolean;
}

export async function getSimulatedCardAlerts(): Promise<PlayerCardAlert[]> {
  const rows = await prisma.simulatedMetric.findMany({
    where: { type: CARD_ACCUMULATION_TYPE, playerId: { not: null } },
    include: { player: true },
  });

  return rows
    .filter((row) => row.player !== null)
    .map((row) => {
      const value = row.value as unknown as { yellowCards: number };
      return {
        playerId: row.player!.id,
        playerName: row.player!.name,
        shirtNumber: row.player!.shirtNumber,
        yellowCards: value.yellowCards,
        isSuspended: value.yellowCards >= SUSPENSION_THRESHOLD,
      };
    })
    .filter((entry) => entry.yellowCards >= SUSPENSION_THRESHOLD - 1)
    .sort((a, b) => b.yellowCards - a.yellowCards);
}
