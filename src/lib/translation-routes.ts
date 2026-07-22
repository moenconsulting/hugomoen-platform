import { getAllArticles } from "./articles";
import { getAllFrameworks } from "./frameworks";
import { localizedPath, isLocale } from "./i18n";
import { findTranslations, type Translatable } from "./translations";

/**
 * Pathname → pathname map between translated content pages, in both
 * directions. Consumed by the global language switcher so switching
 * language on a translated page navigates directly to the translation.
 *
 * With only keyed translation pairs in the content, this map stays tiny
 * and is safe to pass to a client component.
 */
export function getTranslationRouteMap(): Record<string, string> {
  const map: Record<string, string> = {};

  function addPairs<T extends Translatable>(
    items: T[],
    section: "articles" | "frameworks"
  ) {
    for (const item of items) {
      if (!isLocale(item.language)) continue;
      for (const t of findTranslations(item, items)) {
        if (!isLocale(t.language)) continue;
        map[localizedPath(item.language, section, item.slug)] = localizedPath(
          t.language,
          section,
          t.slug
        );
      }
    }
  }

  addPairs(getAllArticles(), "articles");
  addPairs(getAllFrameworks(), "frameworks");

  return map;
}
