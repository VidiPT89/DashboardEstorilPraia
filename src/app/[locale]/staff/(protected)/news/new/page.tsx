import { setRequestLocale } from "next-intl/server";
import { createNewsPost } from "@/lib/actions/news";
import { NewsForm } from "@/components/staff/NewsForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function NewNewsPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const action = createNewsPost.bind(null, locale);

  return <NewsForm action={action} mode="create" />;
}
