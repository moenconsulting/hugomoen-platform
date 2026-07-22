import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTopicBySlugAndLocale, getArticlesByTag } from "@/lib/topics";
import {
  localizedPath,
  contentHref,
  otherLocale,
  type Locale,
} from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";
import LanguageBadge from "@/components/language-badge";

export function buildTopicMetadata(locale: Locale, slug: string): Metadata {
  const topic = getTopicBySlugAndLocale(slug, locale);

  if (!topic) {
    return {};
  }

  const path = localizedPath(locale, "topics", slug);
  // A topic exists per language when at least one article in that
  // language carries the tag. Only link alternates that actually exist.
  const other = otherLocale(locale);
  const otherTopic = getTopicBySlugAndLocale(slug, other);
  const languages: Record<string, string> = { [locale]: path };
  if (otherTopic) {
    languages[other] = localizedPath(other, "topics", slug);
  }

  return {
    title: topic.name,
    description: topic.description,
    alternates: {
      canonical: path,
      ...(otherTopic && { languages }),
    },
    openGraph: {
      type: "website",
      url: path,
      title: topic.name,
      description: topic.description,
      locale: locale === "no" ? "nb_NO" : "en_US",
    },
    twitter: {
      card: "summary",
      title: topic.name,
      description: topic.description,
    },
  };
}

export default function TopicDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const t = getStrings(locale);
  const topic = getTopicBySlugAndLocale(slug, locale);

  if (!topic) {
    notFound();
  }

  const articles = getArticlesByTag(slug, locale);

  return (
    <div>
      <Link
        href={localizedPath(locale, "topics")}
        className="text-sm text-foreground/40 hover:text-foreground transition-colors"
      >
        &larr; {t.topic.back}
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {topic.name}
      </h1>
      {topic.description && (
        <p className="mt-2 text-foreground/60">{topic.description}</p>
      )}
      <p className="mt-1 text-sm text-foreground/40">
        {topic.articleCount}{" "}
        {topic.articleCount === 1
          ? t.listing.articleSingular
          : t.listing.articlePlural}
      </p>

      <ul className="mt-8 divide-y divide-foreground/5">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={contentHref("articles", article)}
              className="flex items-start gap-4 py-4 hover:bg-foreground/[0.02] transition-colors -mx-2 px-2 rounded"
            >
              <div className="w-[100px] h-[64px] shrink-0 rounded overflow-hidden bg-foreground/5">
                {article.heroImage && (
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    width={100}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-sm font-medium leading-snug">
                  {article.title}
                </h2>
                <p className="mt-1 text-sm text-foreground/50 line-clamp-2">
                  {article.description}
                </p>
                <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-foreground/40">
                  <span>
                    <time dateTime={article.date}>{article.date}</time>
                    <span>
                      {" "}
                      · {article.readingTime} {t.listing.minShort}
                    </span>
                  </span>
                  <LanguageBadge
                    contentLanguage={article.language}
                    locale={locale}
                  />
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
