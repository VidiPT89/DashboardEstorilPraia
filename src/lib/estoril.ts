export const ESTORIL_TEAM_ID = Number(process.env.FOOTBALL_DATA_ESTORIL_TEAM_ID ?? "582");
export const COMPETITION_CODE = process.env.FOOTBALL_DATA_COMPETITION_CODE ?? "PPL";

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
