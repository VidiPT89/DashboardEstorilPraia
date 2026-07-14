import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { TeamCrest } from "@/components/ui/TeamCrest";
import { getEstorilTeam } from "@/lib/data/team";

export async function SiteFooter() {
  const t = await getTranslations();
  const team = await getEstorilTeam().catch(() => null);

  return (
    <footer className="header-texture relative bg-[var(--club-blue)] text-white">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[var(--club-yellow)] via-[var(--club-yellow-strong)] to-[var(--club-yellow)]" />
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-10 text-center sm:px-6">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.25)] ring-2 ring-[var(--club-yellow)]/70">
          {team?.crestUrl ? (
            <TeamCrest src={team.crestUrl} alt="Estoril Praia" size={30} />
          ) : (
            <span className="text-base font-bold text-[var(--club-blue-strong)]">EP</span>
          )}
        </span>

        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium text-white/80">
          <Link href="/" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.home")}
          </Link>
          <Link href="/plantel" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.squad")}
          </Link>
          <Link href="/historia" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.history")}
          </Link>
          <Link href="/noticias" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.news")}
          </Link>
          <Link href="/sobre-dados" className="transition-colors hover:text-[var(--club-yellow)]">
            {t("nav.aboutData")}
          </Link>
        </nav>

        <div className="h-px w-16 bg-white/15" aria-hidden="true" />

        <div className="flex flex-col items-center gap-2 text-sm text-white/70">
          <p>
            {t("footer.developedBy")} <span className="font-semibold text-white">David Arsénio Martins</span>
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://ividi.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--club-yellow)]"
            >
              ividi.dev
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://github.com/VidiPT89/"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-[var(--club-yellow)]"
            >
              {t("footer.sourceCode")}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
