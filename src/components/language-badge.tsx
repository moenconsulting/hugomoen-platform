import type { Locale } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";

/**
 * Subtle indicator shown when a listed item's content language differs
 * from the active UI language (cross-language visibility). Renders
 * nothing when the languages match — the common case stays untouched.
 */
export default function LanguageBadge({
  contentLanguage,
  locale,
}: {
  contentLanguage: string;
  locale: Locale;
}) {
  if (contentLanguage === locale) {
    return null;
  }

  const t = getStrings(locale);
  const languageName =
    t.languageNames[contentLanguage] ?? contentLanguage.toUpperCase();

  return (
    <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50 whitespace-nowrap">
      {t.availableIn(languageName)}
    </span>
  );
}
