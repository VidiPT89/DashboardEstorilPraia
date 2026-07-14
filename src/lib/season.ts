export function formatSeasonLabel(season: string | null): string | null {
  if (!season) return null;
  const startYear = Number(season);
  if (Number.isNaN(startYear)) return null;
  return `${startYear}/${String(startYear + 1).slice(-2)}`;
}
