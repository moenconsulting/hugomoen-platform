import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getArticlesByLocale } from "@/lib/articles";
import { localizedPath, contentHref, type Locale } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";
import LanguageBadge from "@/components/language-badge";

export function buildArticlesListMetadata(locale: Locale): Metadata {
  const t = getStrings(locale);
  const path = localizedPath(locale, "articles");
  return {
    title: t.listing.articlesTitle,
    description: t.listing.articlesDescription,
    alternates: {
      canonical: path,
      languages: {
        no: localizedPath("no", "articles"),
        en: localizedPath("en", "articles"),
      },
    },
    openGraph: {
      type: "website",
      url: path,
      title: t.listing.articlesTitle,
      description: t.listing.articlesDescription,
      locale: locale === "no" ? "nb_NO" : "en_US",
    },
    twitter: {
      card: "summary",
      title: t.listing.articlesTitle,
      description: t.listing.articlesDescription,
    },
  };
}

export default function ArticlesListPage({ locale }: { locale: Locale }) {
  const t = getStrings(locale);
  const articles = getArticlesByLocale(locale);

  if (articles.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t.listing.articlesTitle}
        </h1>
        <p className="mt-4 text-foreground/60">{t.listing.noArticles}</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t.listing.articlesTitle}
      </h1>
      <ul className="mt-8 flex flex-col divide-y divide-foreground/5">
        {articles.map((article) => (
          <li key={article.slug} className="py-5 first:pt-0 last:pb-0">
            <article className="flex gap-4">
              <Link
                href={contentHref("articles", article)}
                className="shrink-0 w-[100px] h-[64px] rounded bg-foreground/5 overflow-hidden"
              >
                {article.heroImage && (
                  <Image
                    src={article.heroImage}
                    alt=""
                    width={100}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-sm text-foreground/50">
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
                <h2 className="mt-0.5 text-lg font-medium leading-snug">
                  <Link
                    href={contentHref("articles", article)}
                    className="hover:underline underline-offset-4"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-0.5 text-sm text-foreground/60 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
