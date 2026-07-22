import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";
import {
  getLegacyArticleRedirects,
  findRedirect,
} from "@/lib/legacy-redirects";

export function generateStaticParams() {
  return getLegacyArticleRedirects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const to = findRedirect(getLegacyArticleRedirects(), slug);
  return to ? buildLegacyRedirectMetadata(to) : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const to = findRedirect(getLegacyArticleRedirects(), slug);

  if (!to) {
    notFound();
  }

  return <LegacyRedirect to={to} />;
}
