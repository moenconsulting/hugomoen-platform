import type { Metadata } from "next";
import Link from "next/link";
import { getFrameworksByLocale, getStatusLabel } from "@/lib/frameworks";
import { localizedPath, contentHref, type Locale } from "@/lib/i18n";
import { getStrings } from "@/lib/ui-strings";
import LanguageBadge from "@/components/language-badge";

export function buildFrameworksListMetadata(locale: Locale): Metadata {
  const t = getStrings(locale);
  const path = localizedPath(locale, "frameworks");
  return {
    title: t.listing.frameworksTitle,
    description: t.listing.frameworksDescription,
    alternates: {
      canonical: path,
      languages: {
        no: localizedPath("no", "frameworks"),
        en: localizedPath("en", "frameworks"),
      },
    },
    openGraph: {
      type: "website",
      url: path,
      title: t.listing.frameworksTitle,
      description: t.listing.frameworksDescription,
      locale: locale === "no" ? "nb_NO" : "en_US",
    },
    twitter: {
      card: "summary",
      title: t.listing.frameworksTitle,
      description: t.listing.frameworksDescription,
    },
  };
}

export default function FrameworksListPage({ locale }: { locale: Locale }) {
  const t = getStrings(locale);
  const frameworks = getFrameworksByLocale(locale);

  if (frameworks.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">
          {t.listing.frameworksTitle}
        </h1>
        <p className="mt-2 text-foreground/60">{t.listing.frameworksIntro}</p>
        <p className="mt-8 text-sm text-foreground/40">
          {t.listing.noFrameworks}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">
        {t.listing.frameworksTitle}
      </h1>
      <p className="mt-2 text-foreground/60">{t.listing.frameworksIntro}</p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {frameworks.map((fw) => (
          <li key={fw.slug}>
            <Link
              href={contentHref("frameworks", fw)}
              className="block rounded-lg border border-foreground/5 px-4 py-4 hover:border-foreground/15 transition-colors"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-sm font-medium">{fw.title}</h2>
                {fw.status !== "published" && (
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    {getStatusLabel(fw.status, locale)}
                  </span>
                )}
                <LanguageBadge contentLanguage={fw.language} locale={locale} />
              </div>
              <p className="mt-1 text-sm text-foreground/50 leading-snug">
                {fw.description}
              </p>
              <p className="mt-2 text-xs text-foreground/40">
                {fw.readingTime} {t.framework.readingTime}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
