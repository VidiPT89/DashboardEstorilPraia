// Manually curated 2025/26 season totals — football-data.org's free tier
// doesn't provide per-player match stats for Liga Portugal, and FBref blocks
// automated fetches, so these were cross-checked across ESPN, Soccerway and
// FootyStats search summaries. Only players with at least one confirmed stat
// are listed; everyone else in the squad has no reliable number available
// and is intentionally left out rather than assumed to be zero.

export interface PlayerSeasonStats {
  shirtNumber: number;
  goals: number;
  assists: number;
}

export const SEASON = "2025/26";

export const PLAYER_SEASON_STATS: PlayerSeasonStats[] = [
  { shirtNumber: 14, goals: 19, assists: 0 },
  { shirtNumber: 12, goals: 6, assists: 11 },
  { shirtNumber: 9, goals: 4, assists: 0 },
  { shirtNumber: 99, goals: 3, assists: 5 },
  { shirtNumber: 7, goals: 2, assists: 0 },
  { shirtNumber: 25, goals: 2, assists: 0 },
  { shirtNumber: 19, goals: 2, assists: 0 },
  { shirtNumber: 10, goals: 0, assists: 7 },
];
