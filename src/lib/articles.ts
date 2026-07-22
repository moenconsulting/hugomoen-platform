import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import {
  deduplicateByTranslation,
  findTranslations as findTranslationsGeneric,
  getTranslationGroup as getTranslationGroupGeneric,
  getTranslationLinks,
  type TranslationLink,
} from "./translations";
import { isVisible, normalizeDate } from "./visibility";
import {
  localizedPath,
  isLocale,
  isVisibleInLocale,
  normalizeLanguageList,
  type Locale,
} from "./i18n";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  heroImage?: string;
  readingTime: number;
  draft: boolean;
  publishDate?: string;
  tags: string[];
  frameworks: string[];
  language: string;
  translationKey?: string;
  visibleInLanguages?: string[];
}

export interface ArticleWithContent extends Article {
  content: string;
}

export interface ArticleNavigation {
  previous: { slug: string; title: string } | null;
  next: { slug: string; title: string } | null;
}

const WORDS_PER_MINUTE = 200;

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function parseArticle(fileName: string): Article {
  const slug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(articlesDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug,
    title: data.title,
    date: data.date ?? data.publishedDate ?? "",
    description: data.description ?? "",
    heroImage: data.heroImage,
    readingTime: estimateReadingTime(content),
    draft: data.draft ?? false,
    tags: Array.isArray(data.tags) ? data.tags : [],
    frameworks: Array.isArray(data.framework) ? data.framework : [],
    language: data.language ?? "no",
    translationKey: data.translationKey,
    visibleInLanguages: normalizeLanguageList(data.visibleInLanguages),
    publishDate: normalizeDate(data.publishDate),
  };
}

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseArticle)
    .filter((a) => Boolean(a.title))
    .filter(isVisible)
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithContent | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const article = parseArticle(`${slug}.md`);
  if (!article.title || !isVisible(article)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content: markdownContent } = matter(fileContents);

  const processed = await remark().use(html).process(markdownContent);
  const content = processed.toString();

  return { ...article, content };
}

export function getArticleNavigation(
  slug: string,
  locale?: Locale
): ArticleNavigation {
  const articles = locale ? getArticlesByLocale(locale) : getAllArticles();
  const index = articles.findIndex((a) => a.slug === slug);

  if (index === -1) {
    return { previous: null, next: null };
  }

  const newer = index > 0 ? articles[index - 1] : null;
  const older = index < articles.length - 1 ? articles[index + 1] : null;

  return {
    previous: older ? { slug: older.slug, title: older.title } : null,
    next: newer ? { slug: newer.slug, title: newer.title } : null,
  };
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => name.replace(/\.md$/, ""));
}

/**
 * Slugs of all articles written in `locale`, regardless of visibility.
 * Used by generateStaticParams so drafts still get dev-mode pages.
 */
export function getArticleSlugsByLocale(locale: Locale): string[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  return fs
    .readdirSync(articlesDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseArticle)
    .filter((a) => Boolean(a.title) && a.language === locale)
    .map((a) => a.slug);
}

export function getListingArticles(): Article[] {
  return deduplicateByTranslation(getAllArticles());
}

/**
 * All articles that should appear in the `locale` experience: articles
 * written in that language, plus articles that opt into cross-language
 * visibility via `visibleInLanguages`. Deduplicated by translationKey
 * (the active-language version wins) so a cross-visible item never
 * appears alongside its own translation.
 */
export function getArticlesByLocale(locale: Locale): Article[] {
  return deduplicateByTranslation(
    getAllArticles().filter((a) => isVisibleInLocale(a, locale)),
    locale
  );
}

/**
 * The translation of `article` in `locale`, if one exists — otherwise null.
 * Used to build direct language-switch links and hreflang alternates.
 */
export function getArticleTranslation(
  article: Article,
  locale: Locale
): Article | null {
  return (
    findTranslations(article).find((t) => t.language === locale) ?? null
  );
}

export function getArticlesByFramework(
  frameworkSlug: string,
  locale?: Locale
): Article[] {
  const referencing = getAllArticles().filter((a) =>
    a.frameworks.includes(frameworkSlug)
  );
  if (locale) {
    return deduplicateByTranslation(
      referencing.filter((a) => isVisibleInLocale(a, locale)),
      locale
    );
  }
  return deduplicateByTranslation(referencing);
}

export function getTranslationGroup(article: Article): Article[] {
  return getTranslationGroupGeneric(article, getAllArticles());
}

export function findTranslations(article: Article): Article[] {
  return findTranslationsGeneric(article, getAllArticles());
}

export function getArticleTranslationLinks(
  article: Article
): TranslationLink[] {
  return getTranslationLinks(article, getAllArticles(), (slug, language) =>
    isLocale(language) ? localizedPath(language, "articles", slug) : `/${slug}`
  );
}
