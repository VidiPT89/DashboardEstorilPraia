import { ESTORIL_TEAM_ID } from "@/lib/estoril";
import type { getRecentResults } from "@/lib/data/matches";

type MatchWithTeams = Awaited<ReturnType<typeof getRecentResults>>[number];

type MatchCardProps = {
  match: MatchWithTeams;
  locale: string;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function MatchCard({ match, locale }: MatchCardProps) {
  const isFinished = match.status === "FINISHED";
  const isEstorilHome = match.homeTeam.externalId === ESTORIL_TEAM_ID;

  return (
    <li className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">
          <span className={isEstorilHome ? "font-semibold" : ""}>{match.homeTeam.name}</span>
          {" – "}
          <span className={!isEstorilHome ? "font-semibold" : ""}>{match.awayTeam.name}</span>
        </p>
        <p className="text-xs text-[var(--muted)]">{formatDate(match.utcDate, locale)}</p>
      </div>
      {isFinished ? (
        <span className="shrink-0 rounded-full bg-[var(--surface-raised)] px-3 py-1 text-sm font-semibold tabular-nums">
          {match.homeScore} – {match.awayScore}
        </span>
      ) : null}
    </li>
  );
}
