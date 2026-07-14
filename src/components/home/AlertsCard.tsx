import { getTranslations } from "next-intl/server";
import { getTeamDisplayName } from "@/lib/estoril";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { SimulatedDataBadge } from "@/components/ui/SimulatedDataBadge";
import type { ImportantMatch } from "@/lib/data/matches";
import type { PlayerCardAlert } from "@/lib/data/simulated-metrics";

type AlertsCardProps = {
  importantMatches: ImportantMatch[];
  cardAlerts: PlayerCardAlert[];
  locale: string;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export async function AlertsCard({ importantMatches, cardAlerts, locale }: AlertsCardProps) {
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
                  <TeamCrest src={match.homeTeam.crestUrl} alt={match.homeTeam.name} size={22} />
                  <TeamCrest src={match.awayTeam.crestUrl} alt={match.awayTeam.name} size={22} />
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

      <div className="border-t border-[var(--border)] px-5 py-4">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">{t("cardsTitle")}</h3>
        <div className="mt-2">
          <SimulatedDataBadge label={t("cardsBadgeLabel")} note={t("cardsBadgeNote")} />
        </div>
        {cardAlerts.length === 0 ? (
          <p className="mt-3 text-sm text-[var(--muted)]">{t("noCards")}</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {cardAlerts.map((player) => (
              <li
                key={player.playerId}
                className="flex items-center justify-between gap-3 rounded-lg bg-[var(--surface-raised)] px-3 py-2"
              >
                <span className="text-sm font-medium">
                  {player.playerName}
                  {player.shirtNumber ? (
                    <span className="ml-1.5 text-xs text-[var(--muted)]">#{player.shirtNumber}</span>
                  ) : null}
                </span>
                <span
                  className={`shrink-0 text-xs font-semibold ${
                    player.isSuspended ? "text-[var(--chart-lost)]" : "text-[var(--simulated-accent)]"
                  }`}
                >
                  {player.isSuspended ? t("suspended") : t("atRisk")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
