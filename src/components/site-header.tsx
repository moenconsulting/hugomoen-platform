import Link from "next/link";
import { localizedPath, type Locale, type Section } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";
import { getTranslationRouteMap } from "@/lib/translation-routes";
import LanguageSwitcher from "./language-switcher";
import MobileNav from "./mobile-nav";

const NAV_SECTIONS: Section[] = ["articles", "frameworks", "topics", "about"];

export default function SiteHeader({ locale }: { locale: Locale }) {
  const t = getStrings(locale);
  const translationMap = getTranslationRouteMap();

  const links = NAV_SECTIONS.map((section) => ({
    href: localizedPath(locale, section),
    label: t.nav[section],
  }));

  return (
    <header className="border-b border-foreground/10">
      <nav className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-6 py-4">
        <Link href={`/${locale}`} className="text-lg font-semibold">
          Hugo Moen
        </Link>
        <div className="flex items-center gap-6">
          <ul className="hidden sm:flex gap-6 text-sm">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:underline underline-offset-4"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden sm:block">
            <LanguageSwitcher locale={locale} translationMap={translationMap} />
          </div>
          <MobileNav
            links={links}
            openLabel={t.mobileNav.open}
            closeLabel={t.mobileNav.close}
            navLabel={t.mobileNav.navLabel}
            extra={
              <LanguageSwitcher
                locale={locale}
                translationMap={translationMap}
              />
            }
          />
        </div>
      </nav>
    </header>
  );
}
