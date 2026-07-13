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
