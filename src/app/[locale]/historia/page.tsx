import { getTranslations, setRequestLocale } from "next-intl/server";
import { CLUB_HISTORY, type ClubHistoryCategory } from "@/data/club-history";
import { ClubHistoryTimeline } from "@/components/history/ClubHistoryTimeline";

type PageProps = {
  params: Promise<{ locale: string }>;
};

const CATEGORIES: ClubHistoryCategory[] = ["title", "promotion", "relegation", "milestone"];

export default async function ClubHistoryPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("clubHistory");

  const entries = CLUB_HISTORY.map((entry) => ({
    id: entry.id,
    year: entry.year,
    category: entry.category,
    title: t(`events.${entry.id}.title`),
    description: t(`events.${entry.id}.description`),
  }));

  const categoryLabels = Object.fromEntries(
    CATEGORIES.map((category) => [category, t(`categories.${category}`)]),
  ) as Record<ClubHistoryCategory, string>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      <ClubHistoryTimeline
        entries={entries}
        categoryLabels={categoryLabels}
        allLabel={t("categories.all")}
        filterLabel={t("filterLabel")}
      />
    </div>
  );
}
