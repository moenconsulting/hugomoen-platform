import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { localizedPath, isLocale, DEFAULT_LOCALE } from "./i18n";
import { getTopicSlugsByLocale } from "./topics";

/**
 * Targets for the legacy (pre-v1.1) flat URLs. These power static
 * redirect stub pages so old links keep working on any host — not just
 * where vercel.json redirects apply. vercel.json remains the primary
 * mechanism (real 301s on Vercel); the stubs are the host-agnostic
 * fallback.
 */

export interface LegacyRedirect {
  slug: string;
  to: string;
}

/** Old slugs that no longer exist as files, mapped to their new home. */
const ARTICLE_SLUG_ALIASES: Record<string, string> = {
  "decision-problem.en": localizedPath("en", "articles", "decision-problem"),
};

function readCollection(
  dir: string
): { slug: string; language: string }[] {
  const directory = path.join(process.cwd(), "content", dir);
  if (!fs.existsSync(directory)) {
    return [];
  }
  return fs
    .readdirSync(directory)
    .filter((name) => name.endsWith(".md"))
    .map((name) => {
      const { data } = matter(
        fs.readFileSync(path.join(directory, name), "utf8")
      );
      return {
        slug: data.slug ?? name.replace(/\.md$/, ""),
        language: data.language ?? DEFAULT_LOCALE,
        title: data.title as string | undefined,
      };
    })
    .filter((entry) => Boolean(entry.title));
}

export function getLegacyArticleRedirects(): LegacyRedirect[] {
  const fromFiles = readCollection("articles").map(({ slug, language }) => ({
    slug,
    to: localizedPath(
      isLocale(language) ? language : DEFAULT_LOCALE,
      "articles",
      slug
    ),
  }));
  const fromAliases = Object.entries(ARTICLE_SLUG_ALIASES).map(
    ([slug, to]) => ({ slug, to })
  );
  return [...fromFiles, ...fromAliases];
}

export function getLegacyFrameworkRedirects(): LegacyRedirect[] {
  return readCollection("frameworks").map(({ slug, language }) => ({
    slug,
    to: localizedPath(
      isLocale(language) ? language : DEFAULT_LOCALE,
      "frameworks",
      slug
    ),
  }));
}

export function getLegacyTopicRedirects(): LegacyRedirect[] {
  const noSlugs = getTopicSlugsByLocale("no");
  const enSlugs = getTopicSlugsByLocale("en");
  const all = new Set([...noSlugs, ...enSlugs]);
  // Prefer the Norwegian topic page (the legacy /emner tree was
  // Norwegian-first); fall back to English when the topic only exists there.
  return Array.from(all).map((slug) => ({
    slug,
    to: noSlugs.includes(slug)
      ? localizedPath("no", "topics", slug)
      : localizedPath("en", "topics", slug),
  }));
}

export function findRedirect(
  redirects: LegacyRedirect[],
  slug: string
): string | null {
  return redirects.find((r) => r.slug === slug)?.to ?? null;
}
