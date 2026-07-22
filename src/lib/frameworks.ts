import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";
import { isVisible, normalizeDate } from "./visibility";
import {
  localizedPath,
  isLocale,
  isVisibleInLocale,
  normalizeLanguageList,
  DEFAULT_LOCALE,
  type Locale,
} from "./i18n";
import {
  deduplicateByTranslation,
  findTranslations,
  getTranslationLinks,
  type TranslationLink,
} from "./translations";

const frameworksDirectory = path.join(process.cwd(), "content", "frameworks");

export type FrameworkStatus = "draft" | "emerging" | "published";

export interface Framework {
  slug: string;
  title: string;
  description: string;
  status: FrameworkStatus;
  draft: boolean;
  topics: string[];
  heroImage?: string;
  readingTime: number;
  lastUpdated?: string;
  publishDate?: string;
  language: string;
  translationKey?: string;
  visibleInLanguages?: string[];
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
    draft: data.draft ?? false,
    topics: Array.isArray(data.topics) ? data.topics : [],
    heroImage: data.heroImage,
    readingTime: estimateReadingTime(content),
    lastUpdated: normalizeDate(data.lastUpdated),
    publishDate: normalizeDate(data.publishDate),
    language: data.language ?? "no",
    translationKey: data.translationKey,
    visibleInLanguages: normalizeLanguageList(data.visibleInLanguages),
  };
}

export function getAllFrameworks(): Framework[] {
  if (!fs.existsSync(frameworksDirectory)) {
    return [];
  }

  return fs
    .readdirSync(frameworksDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseFramework)
    .filter((fw) => Boolean(fw.title))
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
    if (!fw.title || !isVisible(fw)) return null;

    const fullPath = path.join(frameworksDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { content: markdownContent } = matter(fileContents);

    const processed = await remark().use(html).process(markdownContent);
    return { ...fw, content: processed.toString() };
  }

  return null;
}

/**
 * All frameworks that should appear in the `locale` experience: those
 * written in that language, plus those opting into cross-language
 * visibility via `visibleInLanguages`. Deduplicated by translationKey so
 * a cross-visible item never appears alongside its own translation.
 */
export function getFrameworksByLocale(locale: Locale): Framework[] {
  return deduplicateByTranslation(
    getAllFrameworks().filter((fw) => isVisibleInLocale(fw, locale)),
    locale
  );
}

/**
 * The translation of `framework` in `locale`, if one exists — otherwise null.
 */
export function getFrameworkTranslation(
  framework: Framework,
  locale: Locale
): Framework | null {
  const group = findTranslations(framework, getAllFrameworks());
  return group.find((t) => t.language === locale) ?? null;
}

/**
 * Language-switch links for a framework's detail page. Empty when the
 * framework has no translations.
 */
export function getFrameworkTranslationLinks(
  framework: Framework
): TranslationLink[] {
  return getTranslationLinks(framework, getAllFrameworks(), (slug, language) =>
    isLocale(language)
      ? localizedPath(language, "frameworks", slug)
      : `/${slug}`
  );
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

/**
 * Slugs of all frameworks written in `locale`, regardless of visibility.
 * Used by generateStaticParams so drafts still get dev-mode pages.
 */
export function getFrameworkSlugsByLocale(locale: Locale): string[] {
  if (!fs.existsSync(frameworksDirectory)) {
    return [];
  }

  return fs
    .readdirSync(frameworksDirectory)
    .filter((name) => name.endsWith(".md"))
    .map(parseFramework)
    .filter((fw) => Boolean(fw.title) && fw.language === locale)
    .map((fw) => fw.slug);
}

const statusLabels: Record<Locale, Record<FrameworkStatus, string>> = {
  no: {
    draft: "Utkast",
    emerging: "Under utvikling",
    published: "Publisert",
  },
  en: {
    draft: "Draft",
    emerging: "Emerging",
    published: "Published",
  },
};

export function getStatusLabel(
  status: FrameworkStatus,
  locale: Locale = DEFAULT_LOCALE
): string {
  return statusLabels[locale][status];
}
