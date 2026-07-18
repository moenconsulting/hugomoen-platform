import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getListingArticles } from "@/lib/articles";
import { getAllTopics } from "@/lib/topics";
import { siteUrl } from "@/lib/config";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    title: "Hugo Knowledge Hub",
    description:
      "Artikler og refleksjoner om plattformarkitektur, virksomhetsarkitektur og samspillet mellom teknologi og organisasjon.",
  },
  twitter: {
    card: "summary",
    title: "Hugo Knowledge Hub",
    description:
      "Artikler og refleksjoner om plattformarkitektur, virksomhetsarkitektur og samspillet mellom teknologi og organisasjon.",
  },
};

export default function Home() {
  const allArticles = getListingArticles();
  const featured = allArticles[0];
  const recent = allArticles.slice(1, 6);
  const topics = getAllTopics();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hugo Knowledge Hub",
    url: siteUrl,
    description:
      "Artikler og refleksjoner om plattformarkitektur, virksomhetsarkitektur og samspillet mellom teknologi og organisasjon.",
    author: {
      "@type": "Person",
      name: "Hugo Moen",
      jobTitle: "Lead Architect",
      url: `${siteUrl}/om`,
    },
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Hugo Knowledge Hub
          </h1>
          <p className="mt-3 max-w-md text-foreground/60 leading-relaxed">
            Artikler og refleksjoner om plattformarkitektur,
            virksomhetsarkitektur og samspillet mellom teknologi og
            organisasjon.
          </p>
        </div>
        <Image
          src="/images/articles/Hugo Moen Profilbilde.jpg"
          alt="Hugo Moen"
          width={160}
          height={160}
          className="rounded-full w-28 h-28 sm:w-36 sm:h-36 object-cover"
          priority
        />
      </section>

      {featured && (
        <section className="mt-14">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
            Siste publisering
          </h2>
          <Link
            href={`/artikler/${featured.slug}`}
            className="mt-4 block rounded-lg border border-foreground/5 hover:border-foreground/15 transition-colors overflow-hidden"
          >
            {featured.heroImage && (
              <Image
                src={featured.heroImage}
                alt={featured.title}
                width={768}
                height={400}
                className="w-full h-auto"
              />
            )}
            <div className="px-5 py-5">
              <h3 className="text-lg font-semibold tracking-tight leading-snug">
                {featured.title}
              </h3>
              <p className="mt-2 text-sm text-foreground/60 leading-relaxed">
                {featured.description}
              </p>
              <div className="mt-3 text-xs text-foreground/40">
                <time dateTime={featured.date}>{featured.date}</time>
                <span> · {featured.readingTime} min lesetid</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      {topics.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Emner
            </h2>
            <Link
              href="/emner"
              className="text-xs text-foreground/40 hover:text-foreground transition-colors"
            >
              Alle emner &rarr;
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {topics.slice(0, 6).map((topic) => (
              <li key={topic.slug}>
                <Link
                  href={`/emner/${topic.slug}`}
                  className="block rounded-lg border border-foreground/5 px-4 py-3 hover:border-foreground/15 transition-colors"
                >
                  <h3 className="text-sm font-medium">{topic.name}</h3>
                  <p className="mt-1 text-xs text-foreground/50 leading-snug">
                    {topic.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {recent.length > 0 && (
        <section className="mt-14">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-foreground/40">
              Flere artikler
            </h2>
            <Link
              href="/artikler"
              className="text-xs text-foreground/40 hover:text-foreground transition-colors"
            >
              Alle artikler &rarr;
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-foreground/5">
            {recent.map((article) => (
              <li key={article.slug} className="py-4 first:pt-0 last:pb-0">
                <article className="flex gap-4">
                  <div className="shrink-0 w-[80px] h-[52px] rounded bg-foreground/5 overflow-hidden">
                    {article.heroImage && (
                      <Image
                        src={article.heroImage}
                        alt=""
                        width={80}
                        height={52}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-foreground/40">
                      <time dateTime={article.date}>{article.date}</time>
                      <span> · {article.readingTime} min</span>
                    </div>
                    <h3 className="text-sm font-medium leading-snug">
                      <Link
                        href={`/artikler/${article.slug}`}
                        className="hover:underline underline-offset-4"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
