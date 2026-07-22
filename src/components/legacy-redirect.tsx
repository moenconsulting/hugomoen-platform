import type { Metadata } from "next";

/**
 * Static redirect stub for legacy URLs. On Vercel, vercel.json serves a
 * real 301 before this page is ever reached; on any other host (local
 * static serving, previews, future infrastructure) this page performs
 * the redirect itself:
 *
 * - <meta http-equiv="refresh"> — works without JavaScript
 * - location.replace()          — instant, keeps the stub out of history
 * - visible link                — last-resort fallback
 * - canonical + noindex        — tells crawlers where the content lives
 */
export function buildLegacyRedirectMetadata(to: string): Metadata {
  return {
    alternates: { canonical: to },
    robots: { index: false, follow: true },
  };
}

export default function LegacyRedirect({ to }: { to: string }) {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-4 px-6 py-24 text-center">
      <meta httpEquiv="refresh" content={`0;url=${to}`} />
      <script
        dangerouslySetInnerHTML={{
          __html: `window.location.replace(${JSON.stringify(to)});`,
        }}
      />
      <p className="text-foreground/60">
        <a
          href={to}
          className="underline underline-offset-4 hover:text-foreground transition-colors"
        >
          {to}
        </a>
      </p>
    </main>
  );
}
