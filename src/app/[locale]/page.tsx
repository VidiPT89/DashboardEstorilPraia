import type { CSSProperties } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentStandings, getPointsEvolution } from "@/lib/data/standings";
import {
  getGoalsPerMatchday,
  getHomeAwaySplit,
  getImportantUpcomingMatches,
  getRecentResults,
  getUpcomingMatches,
} from "@/lib/data/matches";
import { getEstorilTeam, getSquadStats } from "@/lib/data/team";
import { getTeamDisplayName } from "@/lib/estoril";
import { getPlayersWithSeasonStats } from "@/lib/data/player-stats";
import { getNewsPosts } from "@/lib/data/news";
import { getSimulatedCardAlerts } from "@/lib/data/simulated-metrics";
import { StandingsTable } from "@/components/home/StandingsTable";
import { MatchCard } from "@/components/home/MatchCard";
import { Countdown } from "@/components/home/Countdown";
import { PointsEvolutionChart } from "@/components/home/PointsEvolutionChart";
import { GoalsChart } from "@/components/home/GoalsChart";
import { HomeAwayChart } from "@/components/home/HomeAwayChart";
import { TopScorersChart } from "@/components/home/TopScorersChart";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { ClubFactsCard } from "@/components/home/ClubFactsCard";
import { NewsPreview } from "@/components/home/NewsPreview";
import { AlertsCard } from "@/components/home/AlertsCard";

export const dynamic = "force-dynamic";

type HomeData = {
  team: Awaited<ReturnType<typeof getEstorilTeam>>;
  standings: Awaited<ReturnType<typeof getCurrentStandings>>;
  recentResults: Awaited<ReturnType<typeof getRecentResults>>;
  upcomingMatches: Awaited<ReturnType<typeof getUpcomingMatches>>;
  pointsEvolution: Awaited<ReturnType<typeof getPointsEvolution>>;
  goalsPerMatchday: Awaited<ReturnType<typeof getGoalsPerMatchday>>;
  homeAwaySplit: Awaited<ReturnType<typeof getHomeAwaySplit>>;
  topScorers: Awaited<ReturnType<typeof getPlayersWithSeasonStats>>;
  squadStats: Awaited<ReturnType<typeof getSquadStats>>;
  newsPosts: Awaited<ReturnType<typeof getNewsPosts>>;
  importantMatches: Awaited<ReturnType<typeof getImportantUpcomingMatches>>;
  cardAlerts: Awaited<ReturnType<typeof getSimulatedCardAlerts>>;
};

async function loadHomeData(): Promise<HomeData | null> {
  try {
    const team = await getEstorilTeam();
    const [
      standings,
      recentResults,
      upcomingMatches,
      goalsPerMatchday,
      homeAwaySplit,
      topScorers,
      squadStats,
      newsPosts,
      importantMatches,
      cardAlerts,
    ] = await Promise.all([
      getCurrentStandings(),
      getRecentResults(),
      getUpcomingMatches(),
      getGoalsPerMatchday(),
      getHomeAwaySplit(),
      getPlayersWithSeasonStats(),
      getSquadStats(),
      getNewsPosts(3),
      getImportantUpcomingMatches(),
      getSimulatedCardAlerts(),
    ]);
    const pointsEvolution = team && standings.season ? await getPointsEvolution(team.id, standings.season) : [];

    return {
      team,
      standings,
      recentResults,
      upcomingMatches,
      pointsEvolution,
      goalsPerMatchday,
      homeAwaySplit,
      topScorers,
      squadStats,
      newsPosts,
      importantMatches,
      cardAlerts,
    };
  } catch (error) {
    console.error("[home] failed to load dashboard data", error);
    return null;
  }
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

function stagger(index: number): CSSProperties {
  return { "--stagger": index } as CSSProperties;
}

export default async function Home({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const data = await loadHomeData();
  const hasStandings = Boolean(data?.standings.rows.length);
  const nextMatch = data?.upcomingMatches[0];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {nextMatch ? (
        <section
          style={stagger(0)}
          className="animate-in card relative mb-8 overflow-hidden bg-[var(--club-blue)] px-6 py-6 text-white"
        >
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{
              background:
                "radial-gradient(circle at 15% 20%, rgba(255,215,0,0.18), transparent 45%), radial-gradient(circle at 85% 80%, rgba(255,255,255,0.08), transparent 40%)",
            }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-5">
            <div className="flex items-center gap-4">
              <div className="flex items-center -space-x-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 ring-2 ring-white/40">
                  <TeamCrest src={nextMatch.homeTeam.crestUrl} alt={nextMatch.homeTeam.name} size={38} />
                </span>
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 ring-2 ring-white/40">
                  <TeamCrest src={nextMatch.awayTeam.crestUrl} alt={nextMatch.awayTeam.name} size={38} />
                </span>
              </div>
              <div>
                <p className="flex items-center gap-1.5 text-xs uppercase tracking-wide text-white/60">
                  <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-[var(--club-yellow)]" />
                  {t("upcomingMatchesTitle")}
                </p>
                <p className="mt-1 text-lg font-semibold sm:text-xl">
                  {getTeamDisplayName(nextMatch.homeTeam)} – {getTeamDisplayName(nextMatch.awayTeam)}
                </p>
              </div>
            </div>
            <Countdown targetDate={nextMatch.utcDate.toISOString()} />
          </div>
        </section>
      ) : null}

      {!data || !hasStandings ? (
        <div className="card p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <div className="flex flex-col gap-6">
          {data.importantMatches.length > 0 || data.cardAlerts.length > 0 ? (
            <div style={stagger(1)} className="animate-in">
              <AlertsCard importantMatches={data.importantMatches} cardAlerts={data.cardAlerts} locale={locale} />
            </div>
          ) : null}

          <div className="grid gap-6 lg:grid-cols-3">
            <div style={stagger(2)} className="animate-in lg:col-span-2">
              <StandingsTable rows={data.standings.rows} season={data.standings.season} />
            </div>
            {data.team ? (
              <div style={stagger(3)} className="animate-in">
                <ClubFactsCard
                  team={data.team}
                  competition={data.standings.competition}
                  squadStats={data.squadStats}
                  locale={locale}
                />
              </div>
            ) : null}
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div style={stagger(4)} className="animate-in card overflow-hidden">
              <h2 className="section-title border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
                {t("recentResultsTitle")}
              </h2>
              {data.recentResults.length === 0 ? (
                <p className="px-5 py-4 text-sm text-[var(--muted)]">{t("recentResultsEmpty")}</p>
              ) : (
                <ul>
                  {data.recentResults.map((match) => (
                    <MatchCard key={match.id} match={match} locale={locale} />
                  ))}
                </ul>
              )}
            </div>

            <div style={stagger(5)} className="animate-in card overflow-hidden">
              <h2 className="section-title border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
                {t("upcomingMatchesTitle")}
              </h2>
              <ul>
                {data.upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} locale={locale} />
                ))}
              </ul>
            </div>

            <div style={stagger(6)} className="animate-in">
              <NewsPreview posts={data.newsPosts} locale={locale} />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <div style={stagger(7)} className="animate-in">
              <PointsEvolutionChart data={data.pointsEvolution} />
            </div>
            <div style={stagger(8)} className="animate-in">
              <GoalsChart data={data.goalsPerMatchday} />
            </div>
            <div style={stagger(9)} className="animate-in">
              <HomeAwayChart data={data.homeAwaySplit} />
            </div>
            {data.topScorers.length > 0 ? (
              <div style={stagger(10)} className="animate-in">
                <TopScorersChart players={data.topScorers} />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
