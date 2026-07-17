import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const articlesDirectory = path.join(process.cwd(), "content", "articles");

export interface Article {
  slug: string;
  title: string;
  date: string;
  description: string;
  heroImage?: string;
  readingTime: number;
  draft?: boolean;
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

export function getAllArticles(): Article[] {
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(articlesDirectory);

  const articles = fileNames
    .filter((name) => name.endsWith(".md"))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, "");
      const fullPath = path.join(articlesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");
      const { data, content } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
        heroImage: data.heroImage,
        readingTime: estimateReadingTime(content),
        draft: data.draft ?? false,
      };
    })
    .filter((article) => {
      if (process.env.NODE_ENV === "production") {
        return !article.draft;
      }
      return true;
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));

  return articles;
}

export async function getArticleBySlug(
  slug: string
): Promise<ArticleWithContent | null> {
  const fullPath = path.join(articlesDirectory, `${slug}.md`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content: markdownContent } = matter(fileContents);

  const processed = await remark().use(html).process(markdownContent);
  const content = processed.toString();

  return {
    slug,
    title: data.title,
    date: data.date,
    description: data.description,
    heroImage: data.heroImage,
    readingTime: estimateReadingTime(markdownContent),
    draft: data.draft ?? false,
    content,
  };
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
