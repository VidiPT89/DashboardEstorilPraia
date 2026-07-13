import { prisma } from "@/lib/prisma";
import { ESTORIL_TEAM_ID } from "@/lib/estoril";

export async function getEstorilTeam() {
  return prisma.team.findUnique({ where: { externalId: ESTORIL_TEAM_ID } });
}
