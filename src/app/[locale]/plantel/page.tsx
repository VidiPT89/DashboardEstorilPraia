import { differenceInYears } from "date-fns";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEstorilSquad } from "@/lib/data/team";
import { getPlayersWithSeasonStats } from "@/lib/data/player-stats";
import { PlayerComparator } from "@/components/squad/PlayerComparator";
import { ExportButtons } from "@/components/ui/ExportButtons";
import type { ExportRow } from "@/lib/export/csv";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function formatMarketValue(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    style: "currency",
    currency: "EUR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);
}

export default async function SquadPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("squad");
  const players = await getEstorilSquad().catch(() => []);
  const playersWithStats = await getPlayersWithSeasonStats().catch(() => []);

  const exportColumns = [
    { key: "shirtNumber", label: t("table.shirtNumber") },
    { key: "player", label: t("table.player") },
    { key: "position", label: t("table.position") },
    { key: "age", label: t("table.age") },
    { key: "nationality", label: t("table.nationality") },
    { key: "marketValue", label: t("table.marketValue") },
  ];
  const exportRows: ExportRow[] = players.map((player) => ({
    shirtNumber: player.shirtNumber ?? "—",
    player: player.name,
    position: player.position ?? "—",
    age: player.dateOfBirth ? differenceInYears(new Date(), player.dateOfBirth) : "—",
    nationality: player.nationality ?? "—",
    marketValue: player.marketValue ? formatMarketValue(player.marketValue.value, locale) : "—",
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>
        </div>
        {players.length > 0 ? (
          <ExportButtons
            title={t("title")}
            filenameBase="estoril-praia-plantel"
            columns={exportColumns}
            rows={exportRows}
          />
        ) : null}
      </div>

      {players.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <div className="card animate-in mt-8 overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="px-5 py-3 font-medium">{t("table.shirtNumber")}</th>
                <th className="px-2 py-3 font-medium">{t("table.player")}</th>
                <th className="px-2 py-3 font-medium">{t("table.position")}</th>
                <th className="px-2 py-3 text-center font-medium">{t("table.age")}</th>
                <th className="px-2 py-3 font-medium">{t("table.nationality")}</th>
                <th className="px-5 py-3 text-right font-medium">{t("table.marketValue")}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-t border-[var(--border)] transition-colors hover:bg-[var(--surface-raised)]">
                  <td className="px-5 py-2.5 tabular-nums">{player.shirtNumber ?? "—"}</td>
                  <td className="px-2 py-2.5 font-medium">{player.name}</td>
                  <td className="px-2 py-2.5">{player.position ?? "—"}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">
                    {player.dateOfBirth ? differenceInYears(new Date(), player.dateOfBirth) : "—"}
                  </td>
                  <td className="px-2 py-2.5">{player.nationality ?? "—"}</td>
                  <td className="px-5 py-2.5 text-right tabular-nums">
                    {player.marketValue ? formatMarketValue(player.marketValue.value, locale) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {playersWithStats.length >= 2 ? (
        <div className="mt-6">
          <PlayerComparator players={playersWithStats} />
        </div>
      ) : null}
    </div>
  );
}
