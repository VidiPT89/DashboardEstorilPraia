import { getTranslations, setRequestLocale } from "next-intl/server";
import { getFinanceSnapshots } from "@/lib/data/finance";
import { formatSeasonLabel } from "@/lib/season";
import { FinanceChart } from "@/components/finance/FinanceChart";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function formatEuros(value: number, locale: string) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default async function FinancePage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("finance");
  const snapshots = await getFinanceSnapshots();

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      {snapshots.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <>
          <div className="mt-8">
            <FinanceChart data={snapshots} />
          </div>

          <div className="card animate-in mt-6 divide-y divide-[var(--border)]">
            {snapshots.map((snapshot) => (
              <div key={snapshot.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-base font-semibold">{formatSeasonLabel(snapshot.season)}</span>
                  {snapshot.sourceUrl ? (
                    <a
                      href={snapshot.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-medium text-[var(--club-blue)] hover:underline dark:text-[var(--club-yellow)]"
                    >
                      {t("viewReport")}
                    </a>
                  ) : null}
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <div className="stat-pill px-3 py-2 text-center">
                    <div className="text-sm font-bold tabular-nums">
                      {snapshot.revenue !== null ? formatEuros(snapshot.revenue, locale) : "—"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {t("revenueLabel")}
                    </div>
                  </div>
                  <div className="stat-pill px-3 py-2 text-center">
                    <div className="text-sm font-bold tabular-nums">
                      {snapshot.expenses !== null ? formatEuros(snapshot.expenses, locale) : "—"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {t("expensesLabel")}
                    </div>
                  </div>
                  <div className="stat-pill px-3 py-2 text-center">
                    <div
                      className={`text-sm font-bold tabular-nums ${
                        snapshot.netResult !== null && snapshot.netResult >= 0
                          ? "text-[var(--chart-won)]"
                          : "text-[var(--chart-lost)]"
                      }`}
                    >
                      {snapshot.netResult !== null ? formatEuros(snapshot.netResult, locale) : "—"}
                    </div>
                    <div className="text-[10px] uppercase tracking-wide text-[var(--muted)]">
                      {t("resultLabel")}
                    </div>
                  </div>
                </div>

                <p className="mt-3 text-xs text-[var(--muted)]">{t(`notes.${snapshot.season}`)}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
