import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getArticleBySlug,
  getArticleNavigation,
  getArticleTranslationLinks,
  findTranslations,
} from "@/lib/articles";
import { getFrameworkBySlug } from "@/lib/frameworks";
import { getRelatedArticles } from "@/lib/topics";
import { siteUrl } from "@/lib/config";
import { localizedPath, contentHref, isLocale, type Locale } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";
import LanguageBadge from "@/components/language-badge";
import { isScheduled } from "@/lib/visibility";
import { formatDate } from "@/lib/dates";
import ShareButtons from "@/components/share-buttons";

export async function buildArticleMetadata(
  locale: Locale,
  slug: string
): Promise<Metadata> {
  const article = await getArticleBySlug(slug);

  if (!article || article.language !== locale) {
    return {};
  }

  const path = localizedPath(locale, "articles", slug);
  const translations = findTranslations(article);
  const languages: Record<string, string> = { [locale]: path };
  for (const t of translations) {
    if (isLocale(t.language)) {
      languages[t.language] = localizedPath(t.language, "articles", t.slug);
    }
  }

  return {
    title: article.title,
    description: article.description,
    alternates: {
      canonical: path,
      ...(translations.length > 0 && { languages }),
    },
    openGraph: {
      type: "article",
      url: path,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: ["Hugo Moen"],
      locale: locale === "no" ? "nb_NO" : "en_US",
      ...(article.heroImage && {
        images: [{ url: article.heroImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: article.heroImage ? "summary_large_image" : "summary",
      title: article.title,
      description: article.description,
      ...(article.heroImage && {
        images: [article.heroImage],
      }),
    },
  };
}

export default async function ArticleDetailPage({
  locale,
  slug,
}: {
  locale: Locale;
  slug: string;
}) {
  const t = getStrings(locale);
  const article = await getArticleBySlug(slug);

  if (!article || article.language !== locale) {
    notFound();
  }

  const path = localizedPath(locale, "articles", slug);
  const { previous, next } = getArticleNavigation(slug, locale);
  const related = getRelatedArticles(slug, 3, locale);

  const frameworks = await Promise.all(
    article.frameworks.map((fwSlug) => getFrameworkBySlug(fwSlug))
  );
  const linkedFrameworks = frameworks.filter(Boolean);
  // Only the translations, not the current article — this is an
  // availability indicator, not a second language selector.
  const availableTranslations = getArticleTranslationLinks(article).filter(
    (link) => !link.active
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.date,
    url: `${siteUrl}${path}`,
    author: {
      "@type": "Person",
      name: "Hugo Moen",
      jobTitle: "Lead Architect",
      url: `${siteUrl}${localizedPath(locale, "about")}`,
    },
    publisher: {
      "@type": "Person",
      name: "Hugo Moen",
    },
    inLanguage: locale === "en" ? "en" : "nb",
    ...(article.heroImage && {
      image: `${siteUrl}${article.heroImage}`,
    }),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {isScheduled(article) && (
        <div className="mb-6 rounded-md border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
          {t.article.scheduled}: {formatDate(article.publishDate!, locale)}
        </div>
      )}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div className="text-sm text-foreground/50">
            <time dateTime={article.date}>{article.date}</time>
            <span>
              {" "}
              · {article.readingTime} {t.listing.readingTime}
            </span>
          </div>
          {availableTranslations.length > 0 && (
            <p className="text-sm text-foreground/40">
              {t.article.availableInLabel}{" "}
              {availableTranslations.map((link, i) => (
                <span key={link.slug}>
                  {i > 0 && ", "}
                  <Link
                    href={link.href}
                    hrefLang={link.language}
                    lang={link.language}
                    className="text-foreground/60 underline underline-offset-4 decoration-foreground/20 hover:text-foreground hover:decoration-foreground/40 transition-colors"
                  >
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {article.title}
        </h1>
      </header>
      {linkedFrameworks.length > 0 && (
        <div className="mb-8 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-wide text-foreground/40">
            {t.article.partOfFramework}
          </p>
          <ul className="mt-2 space-y-1">
            {linkedFrameworks.map((fw) => (
              <li key={fw!.slug}>
                <Link
                  href={
                    isLocale(fw!.language)
                      ? localizedPath(fw!.language, "frameworks", fw!.slug)
                      : localizedPath(locale, "frameworks", fw!.slug)
                  }
                  className="text-sm font-medium hover:underline underline-offset-4 transition-colors"
                >
                  {fw!.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
      {article.heroImage && (
        <Image
          src={article.heroImage}
          alt={article.title}
          width={768}
          height={432}
          className="mb-8 rounded-lg w-full h-auto"
          priority
        />
      )}
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
      <ShareButtons
        url={`${siteUrl}${path}`}
        heading={t.article.share}
        linkedInAria={t.article.shareOnLinkedIn(article.title)}
        copyLabel={t.article.copyLink}
        copyAria={t.article.copyLinkAria}
        copiedLabel={t.article.copied}
      />
      <footer className="mt-12 border-t border-foreground/10 pt-8">
        <div className="flex gap-4">
          <Image
            src="/images/articles/Hugo Moen Profilbilde.jpg"
            alt="Hugo Moen"
            width={56}
            height={56}
            className="rounded-full w-14 h-14 object-cover shrink-0"
          />
          <div>
            <p className="font-medium">Hugo Moen</p>
            <p className="text-sm text-foreground/50">
              {t.article.authorRole}
            </p>
            <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
              {t.article.authorBio}
            </p>
            <a
              href="https://www.linkedin.com/in/hugomoen/"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-foreground/50 hover:text-foreground transition-colors"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-3.5 h-3.5"
                aria-hidden="true"
              >
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              {t.article.followLinkedIn}
            </a>
          </div>
        </div>
      </footer>

      {related.length > 0 && (
        <section className="mt-12 border-t border-foreground/10 pt-8">
          <h2 className="text-sm font-medium text-foreground/50">
            {t.article.relatedArticles}
          </h2>
          <ul className="mt-4 space-y-4">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={contentHref("articles", r)}
                  className="block rounded-lg border border-foreground/5 px-4 py-3 hover:border-foreground/15 transition-colors"
                >
                  <h3 className="flex flex-wrap items-center gap-2 text-sm font-medium leading-snug">
                    {r.title}
                    <LanguageBadge contentLanguage={r.language} locale={locale} />
                  </h3>
                  <p className="mt-1 text-sm text-foreground/50 leading-snug line-clamp-2">
                    {r.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(previous || next) && (
        <nav className="mt-12 flex items-start justify-between gap-8 border-t border-foreground/10 pt-8 text-sm">
          {previous ? (
            <Link
              href={localizedPath(locale, "articles", previous.slug)}
              className="flex flex-col gap-1 hover:underline underline-offset-4"
            >
              <span className="text-foreground/40">
                &larr; {t.article.previous}
              </span>
              <span>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={localizedPath(locale, "articles", next.slug)}
              className="flex flex-col items-end gap-1 text-right hover:underline underline-offset-4"
            >
              <span className="text-foreground/40">
                {t.article.next} &rarr;
              </span>
              <span>{next.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </article>
  );
}
