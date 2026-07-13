import { differenceInYears } from "date-fns";
import { prisma } from "@/lib/prisma";
import { ESTORIL_TEAM_ID } from "@/lib/estoril";

export async function getEstorilTeam() {
  return prisma.team.findUnique({ where: { externalId: ESTORIL_TEAM_ID } });
}

export async function getEstorilSquad() {
  const team = await getEstorilTeam();
  if (!team) return [];

  const players = await prisma.player.findMany({
    where: { teamId: team.id },
    orderBy: [{ shirtNumber: "asc" }, { name: "asc" }],
    include: {
      marketValues: { orderBy: { asOfDate: "desc" }, take: 1 },
    },
  });

  return players.map((player) => ({
    ...player,
    marketValue: player.marketValues[0] ?? null,
  }));
}

export interface SquadStats {
  playerCount: number;
  averageAge: number | null;
  nationalityCount: number;
  totalMarketValue: number;
  playersWithMarketValue: number;
}

export async function getSquadStats(): Promise<SquadStats> {
  const squad = await getEstorilSquad();

  const ages = squad
    .filter((player) => player.dateOfBirth)
    .map((player) => differenceInYears(new Date(), player.dateOfBirth as Date));
  const nationalities = new Set(squad.map((player) => player.nationality).filter(Boolean));
  const marketValues = squad.map((player) => player.marketValue?.value ?? 0);

  return {
    playerCount: squad.length,
    averageAge: ages.length > 0 ? Math.round((ages.reduce((sum, age) => sum + age, 0) / ages.length) * 10) / 10 : null,
    nationalityCount: nationalities.size,
    totalMarketValue: marketValues.reduce((sum, value) => sum + value, 0),
    playersWithMarketValue: squad.filter((player) => player.marketValue).length,
  };
}
