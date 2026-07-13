import { getTranslations, setRequestLocale } from "next-intl/server";
import { CLUB_HISTORY, type ClubHistoryCategory } from "@/data/club-history";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const CATEGORY_DOT_CLASS: Record<ClubHistoryCategory, string> = {
  title: "bg-[var(--club-yellow)]",
  promotion: "bg-[var(--chart-won)]",
  relegation: "bg-[var(--chart-lost)]",
  milestone: "bg-[var(--club-blue)]",
};

export default async function ClubHistoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("clubHistory");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      <ol className="mt-10 space-y-8 border-l-2 border-[var(--border)] pl-8">
        {CLUB_HISTORY.map((entry) => (
          <li key={entry.id} className="relative">
            <span
              className={`absolute -left-[2.35rem] top-1 h-4 w-4 rounded-full ring-4 ring-[var(--background)] ${CATEGORY_DOT_CLASS[entry.category]}`}
              aria-hidden="true"
            />
            <div className="card p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="text-sm font-semibold tabular-nums text-[var(--muted)]">{entry.year}</span>
                <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-xs font-medium text-[var(--muted)]">
                  {t(`categories.${entry.category}`)}
                </span>
              </div>
              <h2 className="mt-1 text-base font-semibold">{t(`events.${entry.id}.title`)}</h2>
              <p className="mt-1 text-sm text-[var(--muted)]">{t(`events.${entry.id}.description`)}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
