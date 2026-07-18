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
    ...(framework.heroImage && {
      image: `${siteUrl}${framework.heroImage}`,
    }),
  };

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <header className="mb-8">
        <Link
          href="/frameworks"
          className="text-sm text-foreground/40 hover:text-foreground transition-colors"
        >
          &larr; Alle rammeverk
        </Link>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight">
          {framework.title}
        </h1>
        <p className="mt-2 text-foreground/60">{framework.description}</p>
        <div className="mt-2 flex items-center gap-3 text-sm text-foreground/40">
          <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
            {getStatusLabel(framework.status)}
          </span>
          <span>{framework.readingTime} min lesetid</span>
        </div>
      </header>
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
        dangerouslySetInnerHTML={{ __html: framework.content }}
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
    </article>
  );
}
