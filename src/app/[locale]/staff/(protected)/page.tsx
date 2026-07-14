import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { prisma } from "@/lib/prisma";
import { DeletePostButton } from "@/components/staff/DeletePostButton";
import { ChangePasswordForm } from "@/components/staff/ChangePasswordForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

async function getAllNewsPosts() {
  return prisma.newsPost.findMany({ orderBy: { publishedAt: "desc" } });
}

function formatDate(date: Date, locale: string) {
  return new Intl.DateTimeFormat(locale === "pt" ? "pt-PT" : "en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default async function StaffDashboardPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("staff.dashboard");
  const posts = await getAllNewsPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-[var(--border)] px-5 py-4">
          <h2 className="section-title text-base font-semibold">{t("newsTitle")}</h2>
          <Link
            href="/staff/news/new"
            className="rounded-full bg-[var(--club-blue)] px-4 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--club-blue-strong)] dark:bg-[var(--club-yellow)] dark:text-[var(--club-blue-strong)]"
          >
            {t("newPost")}
          </Link>
        </div>
        {posts.length === 0 ? (
          <p className="px-5 py-4 text-sm text-[var(--muted)]">{t("empty")}</p>
        ) : (
          <ul>
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-3 border-t border-[var(--border)] px-5 py-3 first:border-t-0"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{post.title}</p>
                  <p className="text-xs text-[var(--muted)]">{formatDate(post.publishedAt, locale)}</p>
                </div>
                <div className="flex shrink-0 items-center gap-3 text-sm">
                  <Link
                    href={`/staff/news/${post.id}/edit`}
                    className="font-medium text-[var(--club-blue)] hover:underline dark:text-[var(--club-yellow)]"
                  >
                    {t("edit")}
                  </Link>
                  <DeletePostButton postId={post.id} locale={locale} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ChangePasswordForm />
    </div>
  );
}
