import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";
import {
  getLegacyFrameworkRedirects,
  findRedirect,
} from "@/lib/legacy-redirects";

export function generateStaticParams() {
  return getLegacyFrameworkRedirects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const to = findRedirect(getLegacyFrameworkRedirects(), slug);
  return to ? buildLegacyRedirectMetadata(to) : {};
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const to = findRedirect(getLegacyFrameworkRedirects(), slug);

  if (!to) {
    notFound();
  }

  return <LegacyRedirect to={to} />;
}
