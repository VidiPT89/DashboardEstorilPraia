import { differenceInYears } from "date-fns";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getEstorilSquad } from "@/lib/data/team";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SquadPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("squad");
  const players = await getEstorilSquad().catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      {players.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <div className="card mt-8 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-[var(--muted)]">
                <th className="px-5 py-3 font-medium">{t("table.shirtNumber")}</th>
                <th className="px-2 py-3 font-medium">{t("table.player")}</th>
                <th className="px-2 py-3 font-medium">{t("table.position")}</th>
                <th className="px-2 py-3 text-center font-medium">{t("table.age")}</th>
                <th className="px-5 py-3 font-medium">{t("table.nationality")}</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player) => (
                <tr key={player.id} className="border-t border-[var(--border)]">
                  <td className="px-5 py-2.5 tabular-nums">{player.shirtNumber ?? "—"}</td>
                  <td className="px-2 py-2.5 font-medium">{player.name}</td>
                  <td className="px-2 py-2.5">{player.position ?? "—"}</td>
                  <td className="px-2 py-2.5 text-center tabular-nums">
                    {player.dateOfBirth ? differenceInYears(new Date(), player.dateOfBirth) : "—"}
                  </td>
                  <td className="px-5 py-2.5">{player.nationality ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
