import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllTopicSlugs,
  getTopicBySlug,
  getArticlesByTag,
} from "@/lib/topics";

export function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    return {};
  }

  return {
    title: topic.name,
    description: topic.description,
  };
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const articles = getArticlesByTag(slug);

  return (
    <div>
      <Link
        href="/emner"
        className="text-sm text-foreground/40 hover:text-foreground transition-colors"
      >
        &larr; Alle emner
      </Link>

      <h1 className="mt-4 text-3xl font-semibold tracking-tight">
        {topic.name}
      </h1>
      {topic.description && (
        <p className="mt-2 text-foreground/60">{topic.description}</p>
      )}
      <p className="mt-1 text-sm text-foreground/40">
        {topic.articleCount}{" "}
        {topic.articleCount === 1 ? "artikkel" : "artikler"}
      </p>

      <ul className="mt-8 divide-y divide-foreground/5">
        {articles.map((article) => (
          <li key={article.slug}>
            <Link
              href={`/artikler/${article.slug}`}
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
                <div className="mt-1 text-xs text-foreground/40">
                  <time dateTime={article.date}>{article.date}</time>
                  <span> · {article.readingTime} min</span>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
