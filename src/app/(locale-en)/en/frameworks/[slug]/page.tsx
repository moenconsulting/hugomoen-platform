import type { Metadata } from "next";
import FrameworkDetailPage, {
  buildFrameworkMetadata,
} from "@/components/pages/framework-detail-page";
import { getFrameworkSlugsByLocale } from "@/lib/frameworks";

export function generateStaticParams() {
  return getFrameworkSlugsByLocale("en").map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return buildFrameworkMetadata("en", slug);
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <FrameworkDetailPage locale="en" slug={slug} />;
}
