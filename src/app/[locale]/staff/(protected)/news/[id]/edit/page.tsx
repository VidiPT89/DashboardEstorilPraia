import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { prisma } from "@/lib/prisma";
import { updateNewsPost } from "@/lib/actions/news";
import { NewsForm } from "@/components/staff/NewsForm";

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function EditNewsPage({ params }: PageProps) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  const post = await prisma.newsPost.findUnique({ where: { id } });
  if (!post) {
    notFound();
  }

  const action = updateNewsPost.bind(null, locale, post.id);

  return (
    <NewsForm
      action={action}
      mode="edit"
      defaultValues={{
        title: post.title,
        slug: post.slug,
        content: post.content,
        sourceUrl: post.sourceUrl ?? "",
        publishedAt: post.publishedAt.toISOString(),
      }}
    />
  );
}
