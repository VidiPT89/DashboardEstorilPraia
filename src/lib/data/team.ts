import { prisma } from "@/lib/prisma";
import { ESTORIL_TEAM_ID } from "@/lib/estoril";

export async function getEstorilTeam() {
  return prisma.team.findUnique({ where: { externalId: ESTORIL_TEAM_ID } });
}

export async function getEstorilSquad() {
  const team = await getEstorilTeam();
  if (!team) return [];

  return prisma.player.findMany({
    where: { teamId: team.id },
    orderBy: [{ shirtNumber: "asc" }, { name: "asc" }],
  });
}
