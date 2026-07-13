import { getTranslations } from "next-intl/server";
import type { getEstorilTeam } from "@/lib/data/team";
import type { SquadStats } from "@/lib/data/team";
import type { getCurrentStandings } from "@/lib/data/standings";

type ClubFactsCardProps = {
  team: NonNullable<Awaited<ReturnType<typeof getEstorilTeam>>>;
  competition: Awaited<ReturnType<typeof getCurrentStandings>>["competition"];
  squadStats: SquadStats;
  locale: string;
};

function formatCompactEuros(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export async function ClubFactsCard({ team, competition, squadStats, locale }: ClubFactsCardProps) {
  const t = await getTranslations("home.clubFacts");
  const foundedYearsAgo = team.founded ? new Date().getFullYear() - team.founded : null;

  const facts: Array<{ label: string; value: string }> = [];
  if (team.founded) {
    facts.push({ label: t("founded"), value: `${team.founded}${foundedYearsAgo ? ` (${foundedYearsAgo} ${t("yearsAgo")})` : ""}` });
  }
  if (team.venue) {
    facts.push({ label: t("stadium"), value: team.venue });
  }
  if (competition) {
    facts.push({ label: t("competition"), value: competition.name });
  }

  const stats: Array<{ label: string; value: string }> = [
    { label: t("players"), value: String(squadStats.playerCount) },
  ];
  if (squadStats.averageAge) {
    stats.push({ label: t("averageAge"), value: squadStats.averageAge.toFixed(1) });
  }
  stats.push({ label: t("nationalities"), value: String(squadStats.nationalityCount) });
  if (squadStats.totalMarketValue > 0) {
    stats.push({
      label: t("squadValue"),
      value: `${formatCompactEuros(squadStats.totalMarketValue, locale)}+`,
    });
  }

  return (
    <div className="card p-5">
      <h2 className="text-base font-semibold">{t("title")}</h2>

      <dl className="mt-4 space-y-2 text-sm">
        {facts.map((fact) => (
          <div key={fact.label} className="flex items-center justify-between gap-3">
            <dt className="text-[var(--muted)]">{fact.label}</dt>
            <dd className="text-right font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[var(--border)] pt-4">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-pill px-3 py-2 text-center">
            <div className="text-lg font-bold tabular-nums text-[var(--club-blue)] dark:text-[var(--club-yellow)]">
              {stat.value}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
