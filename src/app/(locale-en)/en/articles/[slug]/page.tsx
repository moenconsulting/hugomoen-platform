import type { Metadata } from "next";
import ArticleDetailPage, {
  buildArticleMetadata,
} from "@/components/pages/article-detail-page";
import { getArticleSlugsByLocale } from "@/lib/articles";

export function generateStaticParams() {
  return getArticleSlugsByLocale("en").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildArticleMetadata("en", slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <ArticleDetailPage locale="en" slug={slug} />;
}
