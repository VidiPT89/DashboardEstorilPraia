import { getTranslations, setRequestLocale } from "next-intl/server";
import { getCurrentStandings, getPointsEvolution } from "@/lib/data/standings";
import {
  getGoalsPerMatchday,
  getHomeAwaySplit,
  getRecentResults,
  getUpcomingMatches,
} from "@/lib/data/matches";
import { getEstorilTeam } from "@/lib/data/team";
import { StandingsTable } from "@/components/home/StandingsTable";
import { MatchCard } from "@/components/home/MatchCard";
import { Countdown } from "@/components/home/Countdown";
import { PointsEvolutionChart } from "@/components/home/PointsEvolutionChart";
import { GoalsChart } from "@/components/home/GoalsChart";
import { HomeAwayChart } from "@/components/home/HomeAwayChart";

export const dynamic = "force-dynamic";

type HomeData = {
  standings: Awaited<ReturnType<typeof getCurrentStandings>>;
  recentResults: Awaited<ReturnType<typeof getRecentResults>>;
  upcomingMatches: Awaited<ReturnType<typeof getUpcomingMatches>>;
  pointsEvolution: Awaited<ReturnType<typeof getPointsEvolution>>;
  goalsPerMatchday: Awaited<ReturnType<typeof getGoalsPerMatchday>>;
  homeAwaySplit: Awaited<ReturnType<typeof getHomeAwaySplit>>;
};

async function loadHomeData(): Promise<HomeData | null> {
  try {
    const team = await getEstorilTeam();
    const [standings, recentResults, upcomingMatches, goalsPerMatchday, homeAwaySplit] =
      await Promise.all([
        getCurrentStandings(),
        getRecentResults(),
        getUpcomingMatches(),
        getGoalsPerMatchday(),
        getHomeAwaySplit(),
      ]);
    const pointsEvolution = team ? await getPointsEvolution(team.id) : [];

    return { standings, recentResults, upcomingMatches, pointsEvolution, goalsPerMatchday, homeAwaySplit };
  } catch (error) {
    console.error("[home] failed to load dashboard data", error);
    return null;
  }
}

type PageProps = {
  params: Promise<{ locale: string }>;
};

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
        <section className="card mb-8 flex flex-wrap items-center justify-between gap-4 bg-[var(--club-blue)] px-6 py-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-wide text-white/60">{t("upcomingMatchesTitle")}</p>
            <p className="mt-1 text-lg font-semibold">
              {nextMatch.homeTeam.name} – {nextMatch.awayTeam.name}
            </p>
          </div>
          <Countdown targetDate={nextMatch.utcDate.toISOString()} />
        </section>
      ) : null}

      {!data || !hasStandings ? (
        <div className="card p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <StandingsTable rows={data.standings.rows} />
          </div>

          <div className="flex flex-col gap-6">
            <div className="card overflow-hidden">
              <h2 className="border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
                {t("recentResultsTitle")}
              </h2>
              <ul>
                {data.recentResults.map((match) => (
                  <MatchCard key={match.id} match={match} locale={locale} />
                ))}
              </ul>
            </div>

            <div className="card overflow-hidden">
              <h2 className="border-b border-[var(--border)] px-5 py-4 text-base font-semibold">
                {t("upcomingMatchesTitle")}
              </h2>
              <ul>
                {data.upcomingMatches.map((match) => (
                  <MatchCard key={match.id} match={match} locale={locale} />
                ))}
              </ul>
            </div>
          </div>

          <div className="lg:col-span-3 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            <PointsEvolutionChart data={data.pointsEvolution} />
            <GoalsChart data={data.goalsPerMatchday} />
            <HomeAwayChart data={data.homeAwaySplit} />
          </div>
        </div>
      )}
    </div>
  );
}
