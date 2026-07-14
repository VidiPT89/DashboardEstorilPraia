import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { Link } from "@/i18n/navigation";
import { LoginForm } from "@/components/staff/LoginForm";

type PageProps = {
  params: Promise<{ locale: string }>;
};

export default async function StaffLoginPage({ params }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (session?.user) {
    redirect(`/${locale}/staff`);
  }

  const t = await getTranslations("staff.login");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="card p-8">
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{t("subtitle")}</p>
        <LoginForm />
        <Link
          href="/"
          className="mt-6 block text-center text-sm text-[var(--muted)] transition-colors hover:text-[var(--club-blue)] dark:hover:text-[var(--club-yellow)]"
        >
          {t("backToSite")}
        </Link>
      </div>
    </div>
  );
}
