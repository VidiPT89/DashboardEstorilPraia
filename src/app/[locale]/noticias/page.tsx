import { getTranslations, setRequestLocale } from "next-intl/server";
import { getNewsPosts } from "@/lib/data/news";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export default async function NewsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("news");
  const posts = await getNewsPosts().catch(() => []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <p className="mt-3 text-[var(--muted)]">{t("intro")}</p>

      {posts.length === 0 ? (
        <div className="card mt-8 p-6 text-sm text-[var(--muted)]">{t("noData")}</div>
      ) : (
        <div className="mt-8 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="card p-6">
              <p className="text-xs uppercase tracking-wide text-[var(--muted)]">
                {formatDate(post.publishedAt, locale)}
              </p>
              <h2 className="mt-1 text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-[var(--muted)]">{post.content}</p>
              {post.sourceUrl ? (
                <a
                  href={post.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-block text-sm font-medium text-[var(--club-blue)] hover:underline dark:text-[var(--club-yellow)]"
                >
                  {t("source")} ↗
                </a>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
