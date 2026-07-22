import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { getArticlesByLocale, findTranslations } from "@/lib/articles";
import { getFrameworksByLocale, getFrameworkTranslation } from "@/lib/frameworks";
import { getTopicSlugsByLocale, getTopicBySlugAndLocale } from "@/lib/topics";
import {
  LOCALES,
  localizedPath,
  otherLocale,
  isLocale,
  type Locale,
  type Section,
} from "@/lib/i18n";

export const dynamic = "force-static";

function abs(path: string): string {
  return `${siteUrl}${path}`;
}

function sectionAlternates(section: Section): Record<string, string> {
  return {
    no: abs(localizedPath("no", section)),
    en: abs(localizedPath("en", section)),
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Language gateway
  entries.push({
    url: siteUrl,
    changeFrequency: "weekly",
    priority: 1,
    alternates: {
      languages: { no: abs("/no"), en: abs("/en") },
    },
  });

  for (const locale of LOCALES) {
    // Home
    entries.push({
      url: abs(`/${locale}`),
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: { no: abs("/no"), en: abs("/en") },
      },
    });

    // Section indexes
    const sections: { section: Section; priority: number }[] = [
      { section: "articles", priority: 0.8 },
      { section: "frameworks", priority: 0.8 },
      { section: "topics", priority: 0.6 },
      { section: "about", priority: 0.5 },
    ];
    for (const { section, priority } of sections) {
      entries.push({
        url: abs(localizedPath(locale, section)),
        changeFrequency: section === "articles" ? "weekly" : "monthly",
        priority,
        alternates: { languages: sectionAlternates(section) },
      });
    }

    // Articles — only content written in this locale. Cross-visible items
    // (visibleInLanguages) appear in listings but their canonical URL
    // lives in their own language tree, emitted on that locale's pass.
    for (const article of getArticlesByLocale(locale).filter(
      (a) => a.language === locale
    )) {
      const translations = findTranslations(article);
      const languages: Record<string, string> = {
        [locale]: abs(localizedPath(locale, "articles", article.slug)),
      };
      for (const t of translations) {
        if (isLocale(t.language)) {
          languages[t.language] = abs(
            localizedPath(t.language, "articles", t.slug)
          );
        }
      }
      entries.push({
        url: abs(localizedPath(locale, "articles", article.slug)),
        lastModified: article.date,
        changeFrequency: "monthly",
        priority: 0.7,
        ...(translations.length > 0 && { alternates: { languages } }),
      });
    }

    // Frameworks — same rule: own-language content only.
    for (const fw of getFrameworksByLocale(locale).filter(
      (f) => f.language === locale
    )) {
      const translation = getFrameworkTranslation(fw, otherLocale(locale));
      const languages: Record<string, string> = {
        [locale]: abs(localizedPath(locale, "frameworks", fw.slug)),
      };
      if (translation) {
        languages[otherLocale(locale)] = abs(
          localizedPath(otherLocale(locale), "frameworks", translation.slug)
        );
      }
      entries.push({
        url: abs(localizedPath(locale, "frameworks", fw.slug)),
        changeFrequency: "monthly",
        priority: 0.7,
        ...(translation && { alternates: { languages } }),
      });
    }

    // Topics
    for (const slug of getTopicSlugsByLocale(locale)) {
      const other: Locale = otherLocale(locale);
      const existsInOther = getTopicBySlugAndLocale(slug, other) !== null;
      entries.push({
        url: abs(localizedPath(locale, "topics", slug)),
        changeFrequency: "monthly",
        priority: 0.5,
        ...(existsInOther && {
          alternates: {
            languages: {
              [locale]: abs(localizedPath(locale, "topics", slug)),
              [other]: abs(localizedPath(other, "topics", slug)),
            },
          },
        }),
      });
    }
  }

  return entries;
}
