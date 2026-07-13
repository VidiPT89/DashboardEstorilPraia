import { prisma } from "@/lib/prisma";
import { COMPETITION_CODE } from "@/lib/estoril";

export async function getCurrentStandings() {
  const competition = await prisma.competition.findFirst({
    where: { code: COMPETITION_CODE },
  });

  if (!competition) return { competition: null, season: null, rows: [] };

  const latestMatchday = await prisma.teamSeasonStat.findFirst({
    where: { competitionId: competition.id },
    orderBy: [{ season: "desc" }, { matchday: "desc" }],
    select: { matchday: true, season: true },
  });

  if (!latestMatchday) return { competition, season: null, rows: [] };

  const rows = await prisma.teamSeasonStat.findMany({
    where: {
      competitionId: competition.id,
      season: latestMatchday.season,
      matchday: latestMatchday.matchday,
    },
    include: { team: true },
    orderBy: { position: "asc" },
  });

  return { competition, season: latestMatchday.season, rows };
}

export async function getPointsEvolution(teamId: string, season: string) {
  const competition = await prisma.competition.findFirst({
    where: { code: COMPETITION_CODE },
  });

  if (!competition) return [];

  const rows = await prisma.teamSeasonStat.findMany({
    where: { teamId, competitionId: competition.id, season },
    orderBy: { matchday: "asc" },
    select: { matchday: true, points: true, position: true },
  });

  return rows;
}
