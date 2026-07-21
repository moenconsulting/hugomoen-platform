import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllFrameworkSlugs,
  getFrameworkBySlug,
  getStatusLabel,
} from "@/lib/frameworks";
import { getArticlesByFramework } from "@/lib/articles";
import { siteUrl } from "@/lib/config";
import { formatDate } from "@/lib/dates";
import { extractHeadings, addHeadingIds } from "@/lib/headings";

export function generateStaticParams() {
  return getAllFrameworkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);

  if (!framework) {
    return {};
  }

  return {
    title: framework.title,
    description: framework.description,
    alternates: {
      canonical: `/frameworks/${slug}`,
    },
    openGraph: {
      type: "article",
      url: `/frameworks/${slug}`,
      title: framework.title,
      description: framework.description,
      ...(framework.heroImage && {
        images: [{ url: framework.heroImage, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: framework.heroImage ? "summary_large_image" : "summary",
      title: framework.title,
      description: framework.description,
      ...(framework.heroImage && {
        images: [framework.heroImage],
      }),
    },
  };
}

export default async function FrameworkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const framework = await getFrameworkBySlug(slug);

  if (!framework) {
    notFound();
  }

  const headings = extractHeadings(framework.content);
  const contentWithIds = addHeadingIds(framework.content, headings);
  const relatedArticles = getArticlesByFramework(slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: framework.title,
    description: framework.description,
    url: `${siteUrl}/frameworks/${slug}`,
    author: {
      "@type": "Person",
      name: "Hugo Moen",
      jobTitle: "Lead Architect",
      url: `${siteUrl}/om`,
    },
    ...(framework.lastUpdated && {
      dateModified: framework.lastUpdated,
    }),
    ...(framework.heroImage && {
      image: `${siteUrl}${framework.heroImage}`,
    }),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-10 border-b border-foreground/10 pb-8">
        <Link
          href="/frameworks"
          className="text-sm text-foreground/40 hover:text-foreground transition-colors"
        >
          &larr; Alle rammeverk
        </Link>
        <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-widest text-foreground/30">
          <span>Rammeverk</span>
          {framework.status !== "published" && (
            <>
              <span aria-hidden="true">&middot;</span>
              <span>{getStatusLabel(framework.status)}</span>
            </>
          )}
        </div>
        <h1 className="mt-1.5 text-3xl font-semibold tracking-tight">
          {framework.title}
        </h1>
        <p className="mt-2 text-foreground/60">{framework.description}</p>
        {framework.lastUpdated && (
          <p className="mt-3 text-sm text-foreground/40">
            Sist oppdatert:{" "}
            <time dateTime={framework.lastUpdated} className="text-foreground/60">
              {formatDate(framework.lastUpdated)}
            </time>
          </p>
        )}
      </header>
      {headings.length >= 3 && (
        <nav aria-label="Innholdsfortegnelse" className="mb-10 rounded-lg border border-foreground/10 bg-foreground/[0.02] px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/30">
            Innhold
          </p>
          <ul className="mt-3 space-y-1.5">
            {headings.map((h) => (
              <li key={h.id}>
                <a
                  href={`#${h.id}`}
                  className="text-sm text-foreground/50 hover:text-foreground transition-colors"
                >
                  {h.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
      {framework.heroImage && (
        <Image
          src={framework.heroImage}
          alt={framework.title}
          width={768}
          height={432}
          className="mb-8 rounded-lg w-full h-auto"
          priority
        />
      )}
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: contentWithIds }}
      />

      {relatedArticles.length > 0 && (
        <section className="mt-12 border-t border-foreground/10 pt-8">
          <h2 className="text-sm font-medium text-foreground/50">
            Relaterte artikler
          </h2>
          <ul className="mt-4 space-y-4">
            {relatedArticles.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/artikler/${a.slug}`}
                  className="block rounded-lg border border-foreground/5 px-4 py-3 hover:border-foreground/15 transition-colors"
                >
                  <h3 className="text-sm font-medium leading-snug">
                    {a.title}
                  </h3>
                  <p className="mt-1 text-sm text-foreground/50 leading-snug line-clamp-2">
                    {a.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
