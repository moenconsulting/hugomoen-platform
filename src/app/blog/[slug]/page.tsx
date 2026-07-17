import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSlugs,
  getArticleBySlug,
  getArticleNavigation,
} from "@/lib/articles";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.description,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const { previous, next } = getArticleNavigation(slug);

  return (
    <article>
      <header className="mb-8">
        <div className="text-sm text-foreground/50">
          <time dateTime={article.date}>{article.date}</time>
          <span> · {article.readingTime} min lesetid</span>
        </div>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {article.title}
        </h1>
      </header>
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
      {(previous || next) && (
        <nav className="mt-12 flex items-start justify-between gap-8 border-t border-foreground/10 pt-8 text-sm">
          {previous ? (
            <Link
              href={`/blog/${previous.slug}`}
              className="flex flex-col gap-1 hover:underline underline-offset-4"
            >
              <span className="text-foreground/40">&larr; Forrige</span>
              <span>{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/blog/${next.slug}`}
              className="flex flex-col items-end gap-1 text-right hover:underline underline-offset-4"
            >
              <span className="text-foreground/40">Neste &rarr;</span>
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
