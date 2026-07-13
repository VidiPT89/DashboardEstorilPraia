import { getTranslations } from "next-intl/server";

export async function SiteFooter() {
  const t = await getTranslations("footer");

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center text-sm text-[var(--muted)] sm:px-6">
        <p>
          {t("developedBy")}{" "}
          <span className="font-semibold text-[var(--foreground)]">David Arsénio Martins</span>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://ividi.dev/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--club-blue)]"
          >
            ividi.dev
          </a>
          <span aria-hidden="true">·</span>
          <a
            href="https://github.com/VidiPT89/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-[var(--club-blue)]"
          >
            {t("sourceCode")}
          </a>
        </div>
      </div>
    </footer>
  );
}
