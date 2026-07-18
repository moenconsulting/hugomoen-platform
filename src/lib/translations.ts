export const DEFAULT_LANGUAGE = "no";

export const languageLabels: Record<string, string> = {
  no: "Norsk",
  en: "English",
};

export interface Translatable {
  slug: string;
  language: string;
  translationKey?: string;
}

export interface TranslationLink {
  slug: string;
  language: string;
  label: string;
  active: boolean;
}

export function getTranslationGroup<T extends Translatable>(
  item: T,
  allItems: T[]
): T[] {
  if (!item.translationKey) return [item];
  return allItems.filter((i) => i.translationKey === item.translationKey);
}

export function findTranslations<T extends Translatable>(
  item: T,
  allItems: T[]
): T[] {
  if (!item.translationKey) return [];
  return allItems.filter(
    (i) => i.translationKey === item.translationKey && i.slug !== item.slug
  );
}

export function getPreferredLanguageVersion<T extends Translatable>(
  group: T[],
  preferredLanguage = DEFAULT_LANGUAGE
): T {
  return (
    group.find((i) => i.language === preferredLanguage) ??
    group[0]
  );
}

export function deduplicateByTranslation<T extends Translatable>(
  items: T[],
  preferredLanguage = DEFAULT_LANGUAGE
): T[] {
  const seen = new Set<string>();
  const result: T[] = [];

  for (const item of items) {
    if (!item.translationKey) {
      result.push(item);
      continue;
    }

    if (seen.has(item.translationKey)) continue;
    seen.add(item.translationKey);

    const group = items.filter(
      (i) => i.translationKey === item.translationKey
    );
    result.push(getPreferredLanguageVersion(group, preferredLanguage));
  }

  return result;
}

export function getTranslationLinks<T extends Translatable>(
  current: T,
  allItems: T[],
  buildHref: (slug: string) => string
): TranslationLink[] {
  const group = getTranslationGroup(current, allItems);
  if (group.length <= 1) return [];

  return group
    .sort((a, b) => {
      if (a.language === DEFAULT_LANGUAGE) return -1;
      if (b.language === DEFAULT_LANGUAGE) return 1;
      return a.language.localeCompare(b.language);
    })
    .map((item) => ({
      slug: item.slug,
      language: item.language,
      label: languageLabels[item.language] ?? item.language,
      active: item.slug === current.slug,
    }));
}
