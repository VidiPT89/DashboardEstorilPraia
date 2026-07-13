import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export async function SiteHeader() {
  const t = await getTranslations();

  return (
    <header className="relative bg-[var(--club-blue)] text-white">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-[var(--club-yellow)]" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--club-yellow)] text-sm font-bold text-[var(--club-blue-strong)]">
            EP
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold sm:text-base">Estoril Praia</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-xs">
              {t("header.tagline")}
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-white/85">
          <Link href="/" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.home")}
          </Link>
          <Link href="/sobre-dados" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.aboutData")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
