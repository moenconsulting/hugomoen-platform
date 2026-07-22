import {
  getAllArticles,
  getListingArticles,
  getArticlesByLocale,
  type Article,
} from "./articles";
import type { Locale } from "./i18n";

export interface Topic {
  slug: string;
  name: string;
  description: string;
  articleCount: number;
}

const topicMeta: Record<string, { name: string; description: string }> = {
  beslutningsarkitektur: {
    name: "Beslutningsarkitektur",
    description:
      "Hvordan arkitektur påvirker — og forbedrer — beslutninger i organisasjoner.",
  },
  plattformarkitektur: {
    name: "Plattformarkitektur",
    description:
      "Hvordan plattformer kan muliggjøre autonomi og fart i produktteam.",
  },
  virksomhetsarkitektur: {
    name: "Virksomhetsarkitektur",
    description:
      "Arkitektur som styringsverktøy — ikke bare dokumentasjon.",
  },
  styring: {
    name: "Styring",
    description:
      "Balansen mellom sentral kontroll og lokal handlefrihet.",
  },
  autonomi: {
    name: "Autonomi",
    description:
      "Hvordan autonomi fungerer i praksis — og hva som kreves for at det skal lykkes.",
  },
  organisasjon: {
    name: "Organisasjon",
    description:
      "Samspillet mellom team, ansvar og tekniske grenser.",
  },
  ledelse: {
    name: "Ledelse",
    description:
      "Refleksjoner om lederskap, gjennomslag og verdikommunikasjon.",
  },
  strategi: {
    name: "Strategi",
    description:
      "Strategisk tenkning i skjæringspunktet mellom teknologi og forretning.",
  },
  kommunikasjon: {
    name: "Kommunikasjon",
    description:
      "Hvordan du kommuniserer verdi, innsikt og beslutninger effektivt.",
  },
  adr: {
    name: "ADR",
    description:
      "Architecture Decision Records — dokumentasjon av arkitekturbeslutninger.",
  },
};

function formatTagName(tag: string): string {
  return tag.charAt(0).toUpperCase() + tag.slice(1);
}

function topicsFromArticles(articles: Article[]): Topic[] {
  const tagCounts = new Map<string, number>();

  for (const article of articles) {
    for (const tag of article.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1);
    }
  }

  return Array.from(tagCounts.entries())
    .map(([slug, count]) => {
      const meta = topicMeta[slug];
      return {
        slug,
        name: meta?.name ?? formatTagName(slug),
        description: meta?.description ?? "",
        articleCount: count,
      };
    })
    .sort((a, b) => b.articleCount - a.articleCount || a.name.localeCompare(b.name, "nb"));
}

export function getAllTopics(): Topic[] {
  return topicsFromArticles(getListingArticles());
}

/** Topics derived only from articles in the given language. */
export function getTopicsByLocale(locale: Locale): Topic[] {
  return topicsFromArticles(getArticlesByLocale(locale));
}

export function getTopicBySlug(slug: string): Topic | null {
  return getAllTopics().find((t) => t.slug === slug) ?? null;
}

export function getTopicBySlugAndLocale(
  slug: string,
  locale: Locale
): Topic | null {
  return getTopicsByLocale(locale).find((t) => t.slug === slug) ?? null;
}

export function getArticlesByTag(tag: string, locale?: Locale): Article[] {
  const source = locale ? getArticlesByLocale(locale) : getListingArticles();
  return source.filter((a) => a.tags.includes(tag));
}

export function getAllTopicSlugs(): string[] {
  return getAllTopics().map((t) => t.slug);
}

export function getTopicSlugsByLocale(locale: Locale): string[] {
  return getTopicsByLocale(locale).map((t) => t.slug);
}

export function getRelatedArticles(
  slug: string,
  limit = 3,
  locale?: Locale
): Article[] {
  const articles = locale
    ? getArticlesByLocale(locale)
    : getListingArticles();
  const current = articles.find((a) => a.slug === slug);
  if (!current || current.tags.length === 0) return [];

  const currentTags = new Set(current.tags);

  return articles
    .filter((a) => a.slug !== slug && a.tags.length > 0)
    .map((a) => ({
      article: a,
      shared: a.tags.filter((t) => currentTags.has(t)).length,
    }))
    .filter((r) => r.shared > 0)
    .sort((a, b) => b.shared - a.shared || (a.article.date > b.article.date ? -1 : 1))
    .slice(0, limit)
    .map((r) => r.article);
}
