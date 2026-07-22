import type { Metadata } from "next";
import TopicDetailPage, {
  buildTopicMetadata,
} from "@/components/pages/topic-detail-page";
import { getTopicSlugsByLocale } from "@/lib/topics";

export function generateStaticParams() {
  return getTopicSlugsByLocale("en").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildTopicMetadata("en", slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TopicDetailPage locale="en" slug={slug} />;
}
