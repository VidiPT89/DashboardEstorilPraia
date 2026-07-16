export const ESTORIL_TEAM_ID = Number(process.env.FOOTBALL_DATA_ESTORIL_TEAM_ID ?? "582");
export const COMPETITION_CODE = process.env.FOOTBALL_DATA_COMPETITION_CODE ?? "PPL";

// football-data.org external team IDs for Primeira Liga's traditional "big three"
// (FC Porto, Benfica, Sporting CP) — used to flag fixtures against them as
// high-stakes matches. Stable IDs, not expected to change.
export const BIG_THREE_TEAM_IDS = [503, 1903, 498];

// football-data.org returns "GD Estoril Praia" as the team name — the popular
// name for the club, not the legal entity. The professional team that plays
// Primeira Liga (and runs the Sub-23 side) is actually run by Estoril Praia
// SAD, a distinct entity from Grupo Desportivo Estoril Praia (the parent
// association, which covers the youth academy and other sports sections).
// This override corrects the display name without touching the raw synced
// data, since the next cron sync would otherwise overwrite it.
export const ESTORIL_DISPLAY_NAME = "Estoril Praia SAD";

export function getTeamDisplayName(team: { externalId: number; name: string }): string {
  return team.externalId === ESTORIL_TEAM_ID ? ESTORIL_DISPLAY_NAME : team.name;
}

// football-data.org serves stale or incorrect crest images for a handful of
// teams (confirmed against each club's own official site). This overrides
// the display-only crest URL without touching the synced data, since the
// next cron sync would otherwise overwrite it with the same wrong image.
const CREST_URL_OVERRIDES: Record<number, string> = {
  7822: "https://alvercasad.pt/wp-content/uploads/2025/07/cropped-FC_Site-1-180x180.png", // FC Alverca — football-data.org serves an unrelated bull-head crest
  6618: "https://casapiaac.pt/images/105anos/logo2-dark.png", // Casa Pia AC — football-data.org serves the club's pre-rebrand crest
};

export function getTeamCrestUrl(team: { externalId: number; crestUrl: string | null }): string | null {
  return CREST_URL_OVERRIDES[team.externalId] ?? team.crestUrl;
}
