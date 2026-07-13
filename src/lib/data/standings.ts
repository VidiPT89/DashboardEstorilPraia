import { prisma } from "@/lib/prisma";
import { COMPETITION_CODE } from "@/lib/estoril";

export async function getCurrentStandings() {
  const competition = await prisma.competition.findFirst({
    where: { code: COMPETITION_CODE },
  });

  if (!competition) return { competition: null, rows: [] };

  const latestMatchday = await prisma.teamSeasonStat.findFirst({
    where: { competitionId: competition.id },
    orderBy: { matchday: "desc" },
    select: { matchday: true, season: true },
  });

  if (!latestMatchday) return { competition, rows: [] };

  const rows = await prisma.teamSeasonStat.findMany({
    where: {
      competitionId: competition.id,
      season: latestMatchday.season,
      matchday: latestMatchday.matchday,
    },
    include: { team: true },
    orderBy: { position: "asc" },
  });

  return { competition, rows };
}

export async function getPointsEvolution(teamId: string) {
  const competition = await prisma.competition.findFirst({
    where: { code: COMPETITION_CODE },
  });

  if (!competition) return [];

  const rows = await prisma.teamSeasonStat.findMany({
    where: { teamId, competitionId: competition.id },
    orderBy: { matchday: "asc" },
    select: { matchday: true, points: true, position: true },
  });

  return rows;
}
