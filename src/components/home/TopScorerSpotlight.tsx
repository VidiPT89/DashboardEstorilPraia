import { getTranslations } from "next-intl/server";
import type { PlayerWithStats } from "@/lib/data/player-stats";

type TopScorerSpotlightProps = {
  players: PlayerWithStats[];
};

export async function TopScorerSpotlight({ players }: TopScorerSpotlightProps) {
  const t = await getTranslations("home.topScorerSpotlight");

  if (players.length === 0) return null;

  const topPlayers = [...players]
    .sort((a, b) => b.goals - a.goals || b.assists - a.assists)
    .slice(0, 3);

  return (
    <div className="card overflow-hidden">
      <h2 className="section-title border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
        {t("title")}
      </h2>
      <ul>
        {topPlayers.map((player, index) => (
          <li
            key={player.id}
            className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--surface-raised)] text-xs font-bold tabular-nums text-[var(--muted)]">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{player.name}</p>
              {player.shirtNumber ? (
                <p className="text-xs text-[var(--muted)]">#{player.shirtNumber}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-3 text-right text-sm">
              <span>
                <span className="font-bold tabular-nums text-[var(--club-blue)] dark:text-[var(--club-yellow)]">
                  {player.goals}
                </span>
                <span className="ml-1 text-xs text-[var(--muted)]">{t("goalsShort")}</span>
              </span>
              <span>
                <span className="font-bold tabular-nums">{player.assists}</span>
                <span className="ml-1 text-xs text-[var(--muted)]">{t("assistsShort")}</span>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
