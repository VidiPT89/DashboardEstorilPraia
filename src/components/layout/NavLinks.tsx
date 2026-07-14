"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";

const NAV_ITEMS = [
  { href: "/", key: "home" },
  { href: "/plantel", key: "squad" },
  { href: "/historia", key: "history" },
  { href: "/noticias", key: "news" },
  { href: "/financas", key: "finance" },
  { href: "/sobre-dados", key: "aboutData" },
] as const;

export function NavLinks() {
  const t = useTranslations("nav");
  const pathname = usePathname();

  return (
    <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium text-white/85">
      {NAV_ITEMS.map((item) => {
        const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={`relative py-1 transition-colors after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-[var(--club-yellow)] after:transition-transform after:duration-300 ${
              isActive
                ? "text-white after:scale-x-100"
                : "text-white/85 after:scale-x-0 hover:text-[var(--club-yellow)] hover:after:scale-x-100"
            }`}
          >
            {t(item.key)}
          </Link>
        );
      })}
    </nav>
  );
}
