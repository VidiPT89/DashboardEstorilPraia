import { prisma } from "@/lib/prisma";
import { footballDataClient, type FdMatch, type FdStandingTableRow } from "@/lib/football-data/client";
import { COMPETITION_CODE, ESTORIL_TEAM_ID } from "@/lib/estoril";

async function upsertTeam(id: number, name: string, crestUrl?: string | null) {
  return prisma.team.upsert({
    where: { externalId: id },
    update: { name, ...(crestUrl ? { crestUrl } : {}) },
    create: { externalId: id, name, crestUrl: crestUrl ?? null },
  });
}

async function findOrStubCompetition(id: number) {
  const existing = await prisma.competition.findUnique({ where: { externalId: id } });
  if (existing) return existing;

  return prisma.competition.create({
    data: { externalId: id, name: `Competition ${id}`, code: String(id), area: "" },
  });
}

async function syncStandings() {
  const data = await footballDataClient.getStandings(COMPETITION_CODE);

  const competition = await prisma.competition.upsert({
    where: { externalId: data.competition.id },
    update: {
      name: data.competition.name,
      code: data.competition.code,
      area: data.area.name,
      emblemUrl: data.competition.emblem,
    },
    create: {
      externalId: data.competition.id,
      name: data.competition.name,
      code: data.competition.code,
      area: data.area.name,
      emblemUrl: data.competition.emblem,
    },
  });

  const totalTable = data.standings.find((s) => s.type === "TOTAL")?.table ?? [];
  const season = data.season.startDate.slice(0, 4);
  const matchday = data.season.currentMatchday ?? 0;

  let rowsWritten = 0;
  for (const row of totalTable as FdStandingTableRow[]) {
    const team = await upsertTeam(row.team.id, row.team.name, row.team.crest);

    await prisma.teamSeasonStat.upsert({
      where: {
        teamId_competitionId_season_matchday: {
          teamId: team.id,
          competitionId: competition.id,
          season,
          matchday,
        },
      },
      update: {
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
        position: row.position,
      },
      create: {
        teamId: team.id,
        competitionId: competition.id,
        season,
        matchday,
        played: row.playedGames,
        won: row.won,
        drawn: row.draw,
        lost: row.lost,
        goalsFor: row.goalsFor,
        goalsAgainst: row.goalsAgainst,
        points: row.points,
        position: row.position,
      },
    });
    rowsWritten += 1;
  }

  return { competitionId: competition.id, rowsWritten };
}

async function syncSquad() {
  const team = await footballDataClient.getTeam(ESTORIL_TEAM_ID);

  const dbTeam = await prisma.team.upsert({
    where: { externalId: team.id },
    update: {
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crestUrl: team.crest,
      founded: team.founded,
      venue: team.venue,
    },
    create: {
      externalId: team.id,
      name: team.name,
      shortName: team.shortName,
      tla: team.tla,
      crestUrl: team.crest,
      founded: team.founded,
      venue: team.venue,
    },
  });

  let playersWritten = 0;
  for (const player of team.squad ?? []) {
    await prisma.player.upsert({
      where: { externalId: player.id },
      update: {
        name: player.name,
        position: player.position,
        dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth) : null,
        nationality: player.nationality,
        shirtNumber: player.shirtNumber,
        teamId: dbTeam.id,
      },
      create: {
        externalId: player.id,
        name: player.name,
        position: player.position,
        dateOfBirth: player.dateOfBirth ? new Date(player.dateOfBirth) : null,
        nationality: player.nationality,
        shirtNumber: player.shirtNumber,
        teamId: dbTeam.id,
      },
    });
    playersWritten += 1;
  }

  return { teamId: dbTeam.id, playersWritten };
}

async function syncMatches() {
  const data = await footballDataClient.getTeamMatches(ESTORIL_TEAM_ID);

  let matchesWritten = 0;
  for (const match of data.matches as FdMatch[]) {
    const [homeTeam, awayTeam, competition] = await Promise.all([
      upsertTeam(match.homeTeam.id, match.homeTeam.name, match.homeTeam.crest),
      upsertTeam(match.awayTeam.id, match.awayTeam.name, match.awayTeam.crest),
      findOrStubCompetition(match.competition.id),
    ]);

    await prisma.match.upsert({
      where: { externalId: match.id },
      update: {
        utcDate: new Date(match.utcDate),
        status: match.status,
        matchday: match.matchday,
        stage: match.stage,
        homeScore: match.score.fullTime.home,
        awayScore: match.score.fullTime.away,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        competitionId: competition.id,
      },
      create: {
        externalId: match.id,
        utcDate: new Date(match.utcDate),
        status: match.status,
        matchday: match.matchday,
        stage: match.stage,
        homeScore: match.score.fullTime.home,
        awayScore: match.score.fullTime.away,
        homeTeamId: homeTeam.id,
        awayTeamId: awayTeam.id,
        competitionId: competition.id,
      },
    });
    matchesWritten += 1;
  }

  return { matchesWritten };
}

export async function syncFootballData() {
  const standingsResult = await syncStandings();
  const squadResult = await syncSquad();
  const matchesResult = await syncMatches();

  return {
    standings: standingsResult,
    squad: squadResult,
    matches: matchesResult,
    syncedAt: new Date().toISOString(),
  };
}
