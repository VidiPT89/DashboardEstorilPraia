import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { NavLinks } from "@/components/layout/NavLinks";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { getEstorilTeam } from "@/lib/data/team";

export async function SiteHeader() {
  const t = await getTranslations();
  const team = await getEstorilTeam().catch(() => null);

  return (
    <header className="header-texture sticky top-0 z-50 bg-[var(--club-blue)]/95 text-white shadow-lg shadow-black/10 backdrop-blur">
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

        <NavLinks />

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}
