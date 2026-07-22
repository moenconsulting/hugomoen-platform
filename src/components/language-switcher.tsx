"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALES,
  LOCALE_LABELS,
  SEGMENTS,
  localizedPath,
  type Locale,
  type Section,
} from "@/lib/i18n";

interface LanguageSwitcherProps {
  locale: Locale;
  /** Pathname → pathname map between translated content pages. */
  translationMap: Record<string, string>;
}

export const LANGUAGE_STORAGE_KEY = "hkh-lang";

function persistLanguage(locale: Locale) {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, locale);
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${locale};path=/;max-age=31536000;samesite=lax`;
  } catch {
    // Storage unavailable (private mode etc.) — switching still works.
  }
}

/**
 * Where should switching to `target` take the visitor from `pathname`?
 *
 * 1. A translated page → its translation (via translationMap).
 * 2. A known section → the same section in the target language.
 * 3. Anything else → the target language home page.
 *
 * We never land on unrelated content: without a translation the visitor
 * goes to the equivalent listing, not a different article.
 */
function targetFor(
  pathname: string,
  current: Locale,
  target: Locale,
  translationMap: Record<string, string>
): string {
  const direct = translationMap[pathname];
  if (direct) return direct;

  const parts = pathname.split("/").filter(Boolean);
  if (parts[0] === current && parts.length >= 2) {
    const section = (Object.keys(SEGMENTS) as Section[]).find(
      (s) => SEGMENTS[s][current] === parts[1]
    );
    if (section) return localizedPath(target, section);
  }

  return `/${target}`;
}

export default function LanguageSwitcher({
  locale,
  translationMap,
}: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Norsk / English" className="flex items-center gap-1 text-sm">
      {LOCALES.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && (
            <span className="mx-1 text-foreground/20" aria-hidden="true">
              |
            </span>
          )}
          {l === locale ? (
            <span className="font-medium" aria-current="true">
              {LOCALE_LABELS[l]}
            </span>
          ) : (
            <Link
              href={targetFor(pathname, locale, l, translationMap)}
              hrefLang={l}
              lang={l}
              onClick={() => persistLanguage(l)}
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              {LOCALE_LABELS[l]}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
