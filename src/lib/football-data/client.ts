const BASE_URL = "https://api.football-data.org/v4";

export class FootballDataError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "FootballDataError";
  }
}

async function request<T>(path: string): Promise<T> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;

  if (!apiKey) {
    throw new Error("FOOTBALL_DATA_API_KEY is not set. See .env.example for setup instructions.");
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: { "X-Auth-Token": apiKey },
    // football-data.org free tier updates infrequently; avoid re-fetching within a request cycle.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new FootballDataError(
      `football-data.org request failed: ${path} (${response.status})`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}

export interface FdArea {
  id: number;
  name: string;
}

export interface FdCompetition {
  id: number;
  name: string;
  code: string;
  emblem: string | null;
}

export interface FdTeam {
  id: number;
  name: string;
  shortName: string | null;
  tla: string | null;
  crest: string | null;
  founded: number | null;
  venue: string | null;
  squad?: FdPlayer[];
}

export interface FdPlayer {
  id: number;
  name: string;
  position: string | null;
  dateOfBirth: string | null;
  nationality: string | null;
  shirtNumber: number | null;
}

export interface FdStandingTableRow {
  position: number;
  team: { id: number; name: string; crest: string | null };
  playedGames: number;
  won: number;
  draw: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
}

export interface FdStandingsResponse {
  area: FdArea;
  competition: FdCompetition;
  season: { id: number; startDate: string; endDate: string; currentMatchday: number | null };
  standings: Array<{ type: string; table: FdStandingTableRow[] }>;
}

export interface FdMatch {
  id: number;
  utcDate: string;
  status: string;
  matchday: number | null;
  stage: string | null;
  competition: { id: number };
  homeTeam: { id: number; name: string; crest: string | null };
  awayTeam: { id: number; name: string; crest: string | null };
  score: {
    fullTime: { home: number | null; away: number | null };
  };
}

export interface FdMatchesResponse {
  matches: FdMatch[];
}

export const footballDataClient = {
  getStandings: (competitionCode: string) =>
    request<FdStandingsResponse>(`/competitions/${competitionCode}/standings`),

  getTeam: (teamId: number) => request<FdTeam>(`/teams/${teamId}`),

  getTeamMatches: (teamId: number) => request<FdMatchesResponse>(`/teams/${teamId}/matches`),
};
