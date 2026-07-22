import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
    languages: {
      no: "/no",
      en: "/en",
      "x-default": "/",
    },
  },
};

/**
 * Language gateway for the site root. The site is fully static, so
 * language preference is resolved client-side:
 *
 *   1. stored preference (set by the language switcher)
 *   2. browser language
 *   3. Norwegian (default)
 *
 * Crawlers and no-JS visitors get plain links to both language trees,
 * plus hreflang alternates in the head.
 */
const detectScript = `(function(){
  var l = null;
  try { l = localStorage.getItem("hkh-lang"); } catch (e) {}
  if (l !== "no" && l !== "en") {
    var n = (navigator.language || "").toLowerCase();
    l = n.indexOf("en") === 0 ? "en" : "no";
  }
  window.location.replace("/" + l);
})();`;

export default function LanguageGateway() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-24 text-center">
      <script dangerouslySetInnerHTML={{ __html: detectScript }} />
      <h1 className="text-3xl font-semibold tracking-tight">
        Hugo Knowledge Hub
      </h1>
      <p className="flex items-center gap-3 text-lg">
        <a
          href="/no"
          hrefLang="no"
          lang="no"
          className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
        >
          Norsk
        </a>
        <span className="text-foreground/20" aria-hidden="true">
          ·
        </span>
        <a
          href="/en"
          hrefLang="en"
          lang="en"
          className="underline underline-offset-4 hover:text-foreground/70 transition-colors"
        >
          English
        </a>
      </p>
    </main>
  );
}
