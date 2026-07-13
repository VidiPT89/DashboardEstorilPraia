import { getTranslations } from "next-intl/server";
import { ESTORIL_TEAM_ID } from "@/lib/estoril";
import type { getCurrentStandings } from "@/lib/data/standings";

type StandingsRows = Awaited<ReturnType<typeof getCurrentStandings>>["rows"];

type StandingsTableProps = {
  rows: StandingsRows;
};

export async function StandingsTable({ rows }: StandingsTableProps) {
  const t = await getTranslations("home");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-base font-semibold">{t("standingsTitle")}</h2>
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
                      ? "bg-[var(--club-yellow)]/15 font-semibold"
                      : "border-t border-[var(--border)]"
                  }
                >
                  <td className="px-4 py-2.5">{row.position}</td>
                  <td className="px-4 py-2.5">
                    <span className={isEstoril ? "text-[var(--club-blue)] dark:text-[var(--club-yellow)]" : ""}>
                      {row.team.name}
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
