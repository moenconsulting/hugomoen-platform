import type { Locale } from "./i18n";

/**
 * Localized UI chrome strings. Content itself is localized via the
 * content collections; this dictionary only covers navigation, labels
 * and microcopy rendered by page components.
 */
export interface UiStrings {
  nav: {
    articles: string;
    frameworks: string;
    topics: string;
    about: string;
  };
  home: {
    heroText: string;
    latest: string;
    topics: string;
    allTopics: string;
    moreArticles: string;
    allArticles: string;
  };
  listing: {
    articlesTitle: string;
    articlesDescription: string;
    noArticles: string;
    frameworksTitle: string;
    frameworksIntro: string;
    frameworksDescription: string;
    noFrameworks: string;
    topicsTitle: string;
    topicsIntro: string;
    topicsDescription: string;
    articleSingular: string;
    articlePlural: string;
    readingTime: string;
    minShort: string;
  };
  article: {
    partOfFramework: string;
    relatedArticles: string;
    previous: string;
    next: string;
    languageNav: string;
    availableInLabel: string;
    share: string;
    shareOnLinkedIn: (title: string) => string;
    copyLink: string;
    copyLinkAria: string;
    copied: string;
    authorRole: string;
    authorBio: string;
    followLinkedIn: string;
    scheduled: string;
  };
  framework: {
    back: string;
    badge: string;
    lastUpdated: string;
    toc: string;
    relatedArticles: string;
    readingTime: string;
  };
  topic: {
    back: string;
  };
  mobileNav: {
    open: string;
    close: string;
    navLabel: string;
  };
  meta: {
    siteDescription: string;
  };
  /** Language names as written in this UI language, e.g. no → "engelsk". */
  languageNames: Record<string, string>;
  /** Cross-language visibility indicator, e.g. "Tilgjengelig på engelsk". */
  availableIn: (languageName: string) => string;
}

export const UI_STRINGS: Record<Locale, UiStrings> = {
  no: {
    nav: {
      articles: "Artikler",
      frameworks: "Rammeverk",
      topics: "Emner",
      about: "Om",
    },
    home: {
      heroText:
        "Artikler og refleksjoner om plattformarkitektur, virksomhetsarkitektur og samspillet mellom teknologi og organisasjon.",
      latest: "Siste publisering",
      topics: "Emner",
      allTopics: "Alle emner",
      moreArticles: "Flere artikler",
      allArticles: "Alle artikler",
    },
    listing: {
      articlesTitle: "Artikler",
      articlesDescription: "Artikler om teknologi, utvikling og ledelse.",
      noArticles: "Ingen artikler publisert ennå.",
      frameworksTitle: "Rammeverk",
      frameworksIntro:
        "Modeller og rammeverk for arkitektur, styring og beslutninger.",
      frameworksDescription:
        "Rammeverk og modeller for arkitektur, styring og beslutninger.",
      noFrameworks: "Ingen rammeverk publisert ennå.",
      topicsTitle: "Emner",
      topicsIntro: "Utforsk artikler etter emne.",
      topicsDescription:
        "Utforsk artikler etter emne — arkitektur, ledelse, strategi og mer.",
      articleSingular: "artikkel",
      articlePlural: "artikler",
      readingTime: "min lesetid",
      minShort: "min",
    },
    article: {
      partOfFramework: "Del av rammeverk",
      relatedArticles: "Relaterte artikler",
      previous: "Forrige",
      next: "Neste",
      languageNav: "Språkvalg",
      availableInLabel: "Tilgjengelig på:",
      share: "Del artikkelen",
      shareOnLinkedIn: (title) => `Del "${title}" på LinkedIn`,
      copyLink: "Kopier lenke",
      copyLinkAria: "Kopier lenke til artikkelen",
      copied: "Lenke kopiert!",
      authorRole: "Lead Architect",
      authorBio:
        "Skriver om plattformarkitektur, virksomhetsarkitektur og samspillet mellom teknologi og organisasjon.",
      followLinkedIn: "Følg på LinkedIn",
      scheduled: "Planlagt publisering",
    },
    framework: {
      back: "Alle rammeverk",
      badge: "Rammeverk",
      lastUpdated: "Sist oppdatert",
      toc: "Innhold",
      relatedArticles: "Relaterte artikler",
      readingTime: "min lesetid",
    },
    topic: {
      back: "Alle emner",
    },
    mobileNav: {
      open: "Åpne meny",
      close: "Lukk meny",
      navLabel: "Navigasjon",
    },
    meta: {
      siteDescription:
        "Artikler, refleksjoner og faglig innhold fra Hugo Moen.",
    },
    languageNames: {
      no: "norsk",
      en: "engelsk",
    },
    availableIn: (languageName) => `Tilgjengelig på ${languageName}`,
  },
  en: {
    nav: {
      articles: "Articles",
      frameworks: "Frameworks",
      topics: "Topics",
      about: "About",
    },
    home: {
      heroText:
        "Articles and reflections on platform architecture, enterprise architecture and the interplay between technology and organization.",
      latest: "Latest publication",
      topics: "Topics",
      allTopics: "All topics",
      moreArticles: "More articles",
      allArticles: "All articles",
    },
    listing: {
      articlesTitle: "Articles",
      articlesDescription:
        "Articles on technology, software development and leadership.",
      noArticles: "No articles published yet.",
      frameworksTitle: "Frameworks",
      frameworksIntro:
        "Models and frameworks for architecture, governance and decision-making.",
      frameworksDescription:
        "Frameworks and models for architecture, governance and decision-making.",
      noFrameworks: "No frameworks published yet.",
      topicsTitle: "Topics",
      topicsIntro: "Explore articles by topic.",
      topicsDescription:
        "Explore articles by topic — architecture, leadership, strategy and more.",
      articleSingular: "article",
      articlePlural: "articles",
      readingTime: "min read",
      minShort: "min",
    },
    article: {
      partOfFramework: "Part of framework",
      relatedArticles: "Related articles",
      previous: "Previous",
      next: "Next",
      languageNav: "Language",
      availableInLabel: "Available in:",
      share: "Share this article",
      shareOnLinkedIn: (title) => `Share "${title}" on LinkedIn`,
      copyLink: "Copy link",
      copyLinkAria: "Copy link to this article",
      copied: "Link copied!",
      authorRole: "Lead Architect",
      authorBio:
        "Writes about platform architecture, enterprise architecture and the interplay between technology and organization.",
      followLinkedIn: "Follow on LinkedIn",
      scheduled: "Scheduled for publication",
    },
    framework: {
      back: "All frameworks",
      badge: "Framework",
      lastUpdated: "Last updated",
      toc: "Contents",
      relatedArticles: "Related articles",
      readingTime: "min read",
    },
    topic: {
      back: "All topics",
    },
    mobileNav: {
      open: "Open menu",
      close: "Close menu",
      navLabel: "Navigation",
    },
    meta: {
      siteDescription:
        "Articles, reflections and professional writing from Hugo Moen.",
    },
    languageNames: {
      no: "Norwegian",
      en: "English",
    },
    availableIn: (languageName) => `Available in ${languageName}`,
  },
};

export function getStrings(locale: Locale): UiStrings {
  return UI_STRINGS[locale];
}
