export const LOCALES = ["no", "en"] as const;

export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "no";

export const LOCALE_LABELS: Record<Locale, string> = {
  no: "Norsk",
  en: "English",
};

/**
 * Content sections that have a public URL. Each section maps to a
 * localized URL segment per language. This is the single source of
 * truth the routing layer will consume when it moves to /[lang]/…
 */
export type Section = "articles" | "frameworks" | "topics" | "about";

export const SEGMENTS: Record<Section, Record<Locale, string>> = {
  articles: { no: "artikler", en: "articles" },
  frameworks: { no: "rammeverk", en: "frameworks" },
  topics: { no: "emner", en: "topics" },
  about: { no: "om", en: "about" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "no" ? "en" : "no";
}

export function segmentFor(section: Section, locale: Locale): string {
  return SEGMENTS[section][locale];
}

interface LocalizedContent {
  slug: string;
  language: string;
  visibleInLanguages?: string[];
}

/**
 * Should `item` appear in the `locale` experience? True when the content
 * is written in that language, or when it explicitly opts into
 * cross-language visibility via `visibleInLanguages`.
 */
export function isVisibleInLocale(
  item: Pick<LocalizedContent, "language" | "visibleInLanguages">,
  locale: Locale
): boolean {
  if (item.language === locale) return true;
  return item.visibleInLanguages?.includes(locale) ?? false;
}

/**
 * Canonical href for a content item — always in the item's OWN language
 * tree. A cross-visible English framework listed on /no/rammeverk still
 * links to /en/frameworks/….
 */
export function contentHref(section: Section, item: LocalizedContent): string {
  const locale = isLocale(item.language) ? item.language : DEFAULT_LOCALE;
  return localizedPath(locale, section, item.slug);
}

/**
 * Normalize a frontmatter language list. Guards against the YAML
 * "Norway problem": an unquoted `- no` parses as boolean false.
 */
export function normalizeLanguageList(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const languages = value
    .map((v) => (v === false ? "no" : v === true ? "en" : String(v)))
    .filter((v) => (LOCALES as readonly string[]).includes(v));
  return languages.length > 0 ? languages : undefined;
}

/**
 * Build a localized path, e.g.
 *   localizedPath("no", "articles", "kart-kompass") => "/no/artikler/kart-kompass"
 *   localizedPath("en", "frameworks")               => "/en/frameworks"
 */
export function localizedPath(
  locale: Locale,
  section: Section,
  slug?: string
): string {
  const segment = segmentFor(section, locale);
  return slug ? `/${locale}/${segment}/${slug}` : `/${locale}/${segment}`;
}
