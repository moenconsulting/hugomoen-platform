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
import { isVisible } from "./visibility";

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
    publishDate: data.publishDate,
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
  if (!isVisible(article)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { content: markdownContent } = matter(fileContents);

  const processed = await remark().use(html).process(markdownContent);
  const content = processed.toString();

  return { ...article, content };
}

export function getArticleNavigation(slug: string): ArticleNavigation {
  const articles = getAllArticles();
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

export function getListingArticles(): Article[] {
  return deduplicateByTranslation(getAllArticles());
}

export function getArticlesByFramework(frameworkSlug: string): Article[] {
  return deduplicateByTranslation(
    getAllArticles().filter((a) => a.frameworks.includes(frameworkSlug))
  );
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
  return getTranslationLinks(article, getAllArticles(), (slug) => `/artikler/${slug}`);
}
