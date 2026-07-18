import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const frameworksDirectory = path.join(process.cwd(), "content", "frameworks");

export type FrameworkStatus = "draft" | "emerging" | "published";

export interface Framework {
  slug: string;
  title: string;
  description: string;
  status: FrameworkStatus;
  topics: string[];
  heroImage?: string;
  readingTime: number;
}

export interface FrameworkWithContent extends Framework {
  content: string;
}

const WORDS_PER_MINUTE = 200;

function estimateReadingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE));
}

function normalizeStatus(raw: string | undefined): FrameworkStatus {
  const lower = (raw ?? "draft").toLowerCase();
  if (lower === "published") return "published";
  if (lower === "emerging") return "emerging";
  return "draft";
}

function parseFramework(fileName: string): Framework {
  const fallbackSlug = fileName.replace(/\.md$/, "");
  const fullPath = path.join(frameworksDirectory, fileName);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: data.slug ?? fallbackSlug,
    title: data.title,
    description: data.description ?? "",
    status: normalizeStatus(data.status),
    topics: Array.isArray(data.topics) ? data.topics : [],
    heroImage: data.heroImage,
    readingTime: estimateReadingTime(content),
  };
}

function isVisible(fw: Framework): boolean {
  if (process.env.NODE_ENV === "production") {
    return fw.status !== "draft";
  }
  return true;
}

export function getAllFrameworks(): Framework[] {
  if (!fs.existsSync(frameworksDirectory)) {
    return [];
  }

  return fs
    .readdirSync(frameworksDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseFramework)
    .filter(isVisible)
    .sort((a, b) => a.title.localeCompare(b.title, "nb"));
}

export async function getFrameworkBySlug(
  slug: string
): Promise<FrameworkWithContent | null> {
  if (!fs.existsSync(frameworksDirectory)) {
    return null;
  }

  const files = fs.readdirSync(frameworksDirectory).filter((n) => n.endsWith(".md"));

  for (const fileName of files) {
    const fw = parseFramework(fileName);
    if (fw.slug !== slug) continue;

    const fullPath = path.join(frameworksDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content: markdownContent } = matter(fileContents);

    const processed = await remark().use(html).process(markdownContent);
    return { ...fw, content: processed.toString() };
  }

  return null;
}

export function getAllFrameworkSlugs(): string[] {
  if (!fs.existsSync(frameworksDirectory)) {
    return [];
  }

  return fs
    .readdirSync(frameworksDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseFramework)
    .map((fw) => fw.slug);
}

const statusLabels: Record<FrameworkStatus, string> = {
  draft: "Utkast",
  emerging: "Under utvikling",
  published: "Publisert",
};

export function getStatusLabel(status: FrameworkStatus): string {
  return statusLabels[status];
}
