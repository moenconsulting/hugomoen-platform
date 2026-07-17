import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllSlugs, getArticleBySlug } from "@/lib/articles";

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

  return (
    <article>
      <header className="mb-8">
        <time dateTime={article.date} className="text-sm text-foreground/50">
          {article.date}
        </time>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">
          {article.title}
        </h1>
      </header>
      <div
        className="prose prose-neutral max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </article>
  );
}
