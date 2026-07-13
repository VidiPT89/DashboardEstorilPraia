import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutDataPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("aboutData");

  const sections = [
    { title: t("sourcesTitle"), items: [t("sources.standings"), t("sources.squad"), t("sources.history"), t("sources.marketValues")] },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      {sections.map((section) => (
        <section key={section.title} className="card mt-8 p-6">
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">{t("updateFrequencyTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("updateFrequency")}</p>
      </section>

      <section className="card mt-6 p-6">
        <h2 className="text-lg font-semibold">{t("limitationsTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("limitations")}</p>
      </section>

      <section className="card mt-6 border-l-4 border-l-[var(--club-yellow)] p-6">
        <h2 className="text-lg font-semibold">{t("simulatedDataTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("simulatedData")}</p>
      </section>
    </div>
  );
}
