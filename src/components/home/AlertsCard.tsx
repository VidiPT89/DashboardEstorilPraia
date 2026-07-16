import { getTranslations } from "next-intl/server";
import { getTeamCrestUrl, getTeamDisplayName } from "@/lib/estoril";
import { TeamCrest } from "@/components/ui/TeamCrest";
import type { ImportantMatch } from "@/lib/data/matches";

type AlertsCardProps = {
  importantMatches: ImportantMatch[];
  locale: string;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export async function AlertsCard({ importantMatches, locale }: AlertsCardProps) {
  const t = await getTranslations("home.alerts");

  return (
    <div className="card overflow-hidden">
      <h2 className="section-title border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
        {t("title")}
      </h2>

      <div className="px-5 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t("matchesTitle")}</h3>
        {importantMatches.length === 0 ? (
          <p className="mt-2 text-sm text-[var(--muted)]">{t("noMatches")}</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {importantMatches.map(({ match, reason }) => (
              <li
                key={match.id}
                className="flex items-center gap-3 rounded-lg bg-[var(--surface-raised)] px-3 py-2"
              >
                <span className="flex shrink-0 items-center -space-x-2">
                  <TeamCrest src={getTeamCrestUrl(match.homeTeam)} alt={match.homeTeam.name} size={22} />
                  <TeamCrest src={getTeamCrestUrl(match.awayTeam)} alt={match.awayTeam.name} size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {getTeamDisplayName(match.homeTeam)} – {getTeamDisplayName(match.awayTeam)}
                  </p>
                  <p className="text-xs text-[var(--muted)]">{formatDate(match.utcDate, locale)}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                    reason === "bigMatch"
                      ? "bg-[var(--club-yellow)]/20 text-[var(--club-blue)] dark:text-[var(--club-yellow)]"
                      : "bg-[var(--chart-won)]/15 text-[var(--chart-won)]"
                  }`}
                >
                  {reason === "bigMatch" ? t("bigMatchReason") : t("soonReason")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
