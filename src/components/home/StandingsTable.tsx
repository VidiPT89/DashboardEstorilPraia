import { getTranslations } from "next-intl/server";
import { ESTORIL_TEAM_ID, getTeamCrestUrl, getTeamDisplayName } from "@/lib/estoril";
import type { getCurrentStandings } from "@/lib/data/standings";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { ExportButtons } from "@/components/ui/ExportButtons";
import type { ExportRow } from "@/lib/export/csv";
import { formatSeasonLabel } from "@/lib/season";

type StandingsRows = Awaited<ReturnType<typeof getCurrentStandings>>["rows"];

type StandingsTableProps = {
  rows: StandingsRows;
  season: string | null;
};

export async function StandingsTable({ rows, season }: StandingsTableProps) {
  const t = await getTranslations("home");
  const seasonLabel = formatSeasonLabel(season);

  const exportColumns = [
    { key: "position", label: t("table.position") },
    { key: "team", label: t("table.team") },
    { key: "played", label: t("table.played") },
    { key: "won", label: t("table.won") },
    { key: "drawn", label: t("table.drawn") },
    { key: "lost", label: t("table.lost") },
    { key: "goalsFor", label: t("table.goalsFor") },
    { key: "goalsAgainst", label: t("table.goalsAgainst") },
    { key: "points", label: t("table.points") },
  ];
  const exportRows: ExportRow[] = rows.map((row) => ({
    position: row.position,
    team: getTeamDisplayName(row.team),
    played: row.played,
    won: row.won,
    drawn: row.drawn,
    lost: row.lost,
    goalsFor: row.goalsFor,
    goalsAgainst: row.goalsAgainst,
    points: row.points,
  }));

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--border)] px-5 py-4">
        <h2 className="section-title text-base font-semibold">{t("standingsTitle")}</h2>
        <div className="flex items-center gap-2">
          {seasonLabel ? (
            <span className="stat-pill px-2.5 py-1 text-xs font-medium text-[var(--muted)]">{seasonLabel}</span>
          ) : null}
          <ExportButtons
            title={t("standingsTitle")}
            filenameBase={`estoril-praia-classificacao-${season ?? "atual"}`}
            columns={exportColumns}
            rows={exportRows}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
              <th className="px-4 py-2 font-medium">{t("table.position")}</th>
              <th className="px-4 py-2 font-medium">{t("table.team")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.played")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.won")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.drawn")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.lost")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.goalsFor")}</th>
              <th className="px-2 py-2 text-center font-medium">{t("table.goalsAgainst")}</th>
              <th className="px-4 py-2 text-center font-medium">{t("table.points")}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isEstoril = row.team.externalId === ESTORIL_TEAM_ID;
              return (
                <tr
                  key={row.id}
                  className={
                    isEstoril
                      ? "bg-[var(--club-yellow)]/15 font-semibold transition-colors hover:bg-[var(--club-yellow)]/25"
                      : "border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-raised)]"
                  }
                >
                  <td className="px-4 py-2.5">{row.position}</td>
                  <td className="px-4 py-2.5">
                    <span className="flex items-center gap-2.5">
                      <TeamCrest src={getTeamCrestUrl(row.team)} alt={row.team.name} size={20} className="shrink-0" />
                      <span className={isEstoril ? "text-[var(--club-blue)] dark:text-[var(--club-yellow)]" : ""}>
                        {getTeamDisplayName(row.team)}
                      </span>
                    </span>
                  </td>
                  <td className="px-2 py-2.5 text-center">{row.played}</td>
                  <td className="px-2 py-2.5 text-center">{row.won}</td>
                  <td className="px-2 py-2.5 text-center">{row.drawn}</td>
                  <td className="px-2 py-2.5 text-center">{row.lost}</td>
                  <td className="px-2 py-2.5 text-center">{row.goalsFor}</td>
                  <td className="px-2 py-2.5 text-center">{row.goalsAgainst}</td>
                  <td className="px-4 py-2.5 text-center">{row.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[var(--border)] px-5 py-3 text-xs text-[var(--muted)]">
        {t("standingsUpdatedNote")}
      </p>
    </div>
  );
}
