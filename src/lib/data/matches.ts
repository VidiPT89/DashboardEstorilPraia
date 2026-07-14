import { prisma } from "@/lib/prisma";
import { getEstorilTeam } from "@/lib/data/team";
import { BIG_THREE_TEAM_IDS } from "@/lib/estoril";

const IMPORTANT_MATCH_WINDOW_DAYS = 7;

export type ImportantMatchReason = "bigMatch" | "soon";

export interface ImportantMatch {
  match: Awaited<ReturnType<typeof getUpcomingMatches>>[number];
  reason: ImportantMatchReason;
}

export async function getImportantUpcomingMatches(limit = 5): Promise<ImportantMatch[]> {
  const team = await getEstorilTeam();
  if (!team) return [];

  const windowEnd = new Date();
  windowEnd.setDate(windowEnd.getDate() + IMPORTANT_MATCH_WINDOW_DAYS);

  const matches = await prisma.match.findMany({
    where: {
      status: { in: ["SCHEDULED", "TIMED"] },
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { utcDate: "asc" },
    take: limit * 3,
  });

  const important = matches
    .map((match) => {
      const isBigMatch =
        BIG_THREE_TEAM_IDS.includes(match.homeTeam.externalId) ||
        BIG_THREE_TEAM_IDS.includes(match.awayTeam.externalId);
      const isSoon = match.utcDate <= windowEnd;

      if (isBigMatch) return { match, reason: "bigMatch" as const };
      if (isSoon) return { match, reason: "soon" as const };
      return null;
    })
    .filter((entry): entry is ImportantMatch => entry !== null);

  return important.slice(0, limit);
}

export async function getRecentResults(limit = 5) {
  const team = await getEstorilTeam();
  if (!team) return [];

  return prisma.match.findMany({
    where: {
      status: "FINISHED",
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { utcDate: "desc" },
    take: limit,
  });
}

export async function getUpcomingMatches(limit = 5) {
  const team = await getEstorilTeam();
  if (!team) return [];

  return prisma.match.findMany({
    where: {
      status: { in: ["SCHEDULED", "TIMED"] },
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    include: { homeTeam: true, awayTeam: true, competition: true },
    orderBy: { utcDate: "asc" },
    take: limit,
  });
}

export interface MatchdayGoals {
  matchday: number;
  scored: number;
  conceded: number;
}

export async function getGoalsPerMatchday(): Promise<MatchdayGoals[]> {
  const team = await getEstorilTeam();
  if (!team) return [];

  const matches = await prisma.match.findMany({
    where: {
      status: "FINISHED",
      matchday: { not: null },
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
    orderBy: { matchday: "asc" },
  });

  return matches
    .filter((m) => m.matchday !== null)
    .map((m) => {
      const isHome = m.homeTeamId === team.id;
      const scored = (isHome ? m.homeScore : m.awayScore) ?? 0;
      const conceded = (isHome ? m.awayScore : m.homeScore) ?? 0;
      return { matchday: m.matchday as number, scored, conceded };
    });
}

export interface HomeAwaySplit {
  venue: "home" | "away";
  won: number;
  drawn: number;
  lost: number;
}

export async function getHomeAwaySplit(): Promise<HomeAwaySplit[]> {
  const team = await getEstorilTeam();
  if (!team) return [];

  const matches = await prisma.match.findMany({
    where: {
      status: "FINISHED",
      OR: [{ homeTeamId: team.id }, { awayTeamId: team.id }],
    },
  });

  const split: Record<"home" | "away", HomeAwaySplit> = {
    home: { venue: "home", won: 0, drawn: 0, lost: 0 },
    away: { venue: "away", won: 0, drawn: 0, lost: 0 },
  };

  for (const match of matches) {
    const isHome = match.homeTeamId === team.id;
    const venue = isHome ? "home" : "away";
    const goalsFor = (isHome ? match.homeScore : match.awayScore) ?? 0;
    const goalsAgainst = (isHome ? match.awayScore : match.homeScore) ?? 0;

    if (goalsFor > goalsAgainst) split[venue].won += 1;
    else if (goalsFor === goalsAgainst) split[venue].drawn += 1;
    else split[venue].lost += 1;
  }

  return [split.home, split.away];
}
