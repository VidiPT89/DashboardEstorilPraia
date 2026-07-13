import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { getNewsPosts } from "@/lib/data/news";

type NewsPreviewProps = {
  posts: Awaited<ReturnType<typeof getNewsPosts>>;
  locale: string;
};

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
  }).format(date);
}

export async function NewsPreview({ posts, locale }: NewsPreviewProps) {
  const t = await getTranslations("home");

  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
        <h2 className="text-base font-semibold">{t("newsTitle")}</h2>
        <Link href="/noticias" className="text-xs font-medium text-[var(--club-blue)] hover:underline dark:text-[var(--club-yellow)]">
          {t("newsSeeAll")}
        </Link>
      </div>
      {posts.length === 0 ? (
        <p className="px-5 py-4 text-sm text-[var(--muted)]">{t("newsEmpty")}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="border-t border-[var(--border)] px-5 py-3 transition-colors first:border-t-0 hover:bg-[var(--surface-raised)]">
              <p className="text-xs text-[var(--muted)]">{formatDate(post.publishedAt, locale)}</p>
              <p className="mt-0.5 text-sm font-medium leading-snug">{post.title}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
