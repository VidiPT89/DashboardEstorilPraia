import { getTranslations, setRequestLocale } from "next-intl/server";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutDataPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("aboutData");

  const sections = [
    {
      title: t("sourcesTitle"),
      items: [
        t("sources.standings"),
        t("sources.squad"),
        t("sources.history"),
        t("sources.news"),
        t("sources.marketValues"),
        t("sources.playerStats"),
        t("sources.physical"),
        t("sources.alerts"),
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      <section
        style={{ "--stagger": 0 } as React.CSSProperties}
        className="card animate-in mt-8 border-l-4 border-l-[var(--club-blue)] p-6"
      >
        <h2 className="text-lg font-semibold">{t("entityTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("entityNote")}</p>
      </section>

      {sections.map((section, index) => (
        <section
          key={section.title}
          style={{ "--stagger": index + 1 } as React.CSSProperties}
          className="card animate-in mt-6 p-6"
        >
          <h2 className="text-lg font-semibold">{section.title}</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-[var(--muted)]">
            {section.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}

      <section style={{ "--stagger": 2 } as React.CSSProperties} className="card animate-in mt-6 p-6">
        <h2 className="text-lg font-semibold">{t("updateFrequencyTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("updateFrequency")}</p>
      </section>

      <section style={{ "--stagger": 3 } as React.CSSProperties} className="card animate-in mt-6 p-6">
        <h2 className="text-lg font-semibold">{t("limitationsTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("limitations")}</p>
      </section>

      <section
        style={{ "--stagger": 4 } as React.CSSProperties}
        className="card animate-in mt-6 border-l-4 border-l-[var(--club-yellow)] p-6"
      >
        <h2 className="text-lg font-semibold">{t("simulatedDataTitle")}</h2>
        <p className="mt-3 text-sm text-[var(--muted)]">{t("simulatedData")}</p>
      </section>
    </div>
  );
}
