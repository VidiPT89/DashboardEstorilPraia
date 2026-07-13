import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { getEstorilTeam } from "@/lib/data/team";

export async function SiteHeader() {
  const t = await getTranslations();
  const team = await getEstorilTeam().catch(() => null);

  return (
    <header className="header-texture relative bg-[var(--club-blue)] text-white">
      <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-[var(--club-yellow)] via-[var(--club-yellow-strong)] to-[var(--club-yellow)]" />
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <span className="animate-crest flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-2 ring-[var(--club-yellow)]/70 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
            {team?.crestUrl ? (
              <TeamCrest src={team.crestUrl} alt="Estoril Praia" size={26} />
            ) : (
              <span className="text-sm font-bold text-[var(--club-blue-strong)]">EP</span>
            )}
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold sm:text-base">Estoril Praia</span>
            <span className="block text-[10px] uppercase tracking-[0.2em] text-white/60 sm:text-xs">
              {t("header.tagline")}
            </span>
          </span>
        </Link>

        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-white/85">
          <Link href="/" className="relative py-1 transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.home")}
          </Link>
          <Link href="/plantel" className="relative py-1 transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.squad")}
          </Link>
          <Link href="/historia" className="relative py-1 transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.history")}
          </Link>
          <Link href="/noticias" className="relative py-1 transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.news")}
          </Link>
          <Link href="/sobre-dados" className="relative py-1 transition-colors hover:text-[var(--club-yellow)]">
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
