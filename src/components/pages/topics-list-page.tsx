import type { Metadata } from "next";
import Link from "next/link";
import { getTopicsByLocale } from "@/lib/topics";
import { localizedPath, type Locale } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";

export function buildTopicsListMetadata(locale: Locale): Metadata {
  const t = getStrings(locale);
  const path = localizedPath(locale, "topics");
  return {
    title: t.listing.topicsTitle,
    description: t.listing.topicsDescription,
    alternates: {
      canonical: path,
      languages: {
        no: localizedPath("no", "topics"),
        en: localizedPath("en", "topics"),
      },
    },
    openGraph: {
      type: "website",
      url: path,
      title: t.listing.topicsTitle,
      description: t.listing.topicsDescription,
      locale: locale === "no" ? "nb_NO" : "en_US",
    },
    twitter: {
      card: "summary",
      title: t.listing.topicsTitle,
      description: t.listing.topicsDescription,
    },
  };
}

export default function TopicsListPage({ locale }: { locale: Locale }) {
  const t = getStrings(locale);
  const topics = getTopicsByLocale(locale);

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t.listing.topicsTitle}
      </h1>
      <p className="mt-2 text-foreground/60">{t.listing.topicsIntro}</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={localizedPath(locale, "topics", topic.slug)}
              className="block rounded-lg border border-foreground/5 px-4 py-4 hover:border-foreground/15 transition-colors"
            >
              <h2 className="text-sm font-medium">{topic.name}</h2>
              {topic.description && (
                <p className="mt-1 text-sm text-foreground/50 leading-snug">
                  {topic.description}
                </p>
              )}
              <p className="mt-2 text-xs text-foreground/40">
                {topic.articleCount}{" "}
                {topic.articleCount === 1
                  ? t.listing.articleSingular
                  : t.listing.articlePlural}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
