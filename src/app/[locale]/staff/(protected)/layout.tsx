import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/staff/LogoutButton";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function StaffProtectedLayout({ children, params }: LayoutProps) {
  const { locale } = await params;
  setRequestLocale(locale);

  const session = await auth();
  if (!session?.user) {
    redirect(`/${locale}/staff/login`);
  }

  const t = await getTranslations("staff.nav");

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
        <div>
          <h1 className="text-lg font-bold">{t("dashboard")}</h1>
          <p className="text-xs text-[var(--muted)]">
            {t("loggedInAs")} <span className="font-medium text-[var(--foreground)]">{session.user.name}</span>
          </p>
        </div>
        <LogoutButton />
      </div>
      {children}
    </div>
  );
}
