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
  draft?: boolean;
}

export interface ArticleWithContent extends Article {
  content: string;
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
      const { data } = matter(fileContents);

      return {
        slug,
        title: data.title,
        date: data.date,
        description: data.description,
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
    draft: data.draft ?? false,
    content,
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
