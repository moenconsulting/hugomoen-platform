import type { Metadata } from "next";
import Image from "next/image";
import { siteUrl } from "@/lib/config";
import { localizedPath, type Locale } from "@/lib/i18n";

interface AboutContent {
  title: string;
  description: string;
  role: string;
  intro: string[];
  writeAboutHeading: string;
  topics: { name: string; description: string }[];
  contributionsHeading: string;
  contributionsIntro: string;
  contributionTopics: string[];
  contact: string;
  hubHeading: string;
  hubParagraphs: string[];
}

const CONTENT: Record<Locale, AboutContent> = {
  no: {
    title: "Om",
    description:
      "Hugo Moen er Lead Architect og jobber i skjæringspunktet mellom forretning, produkt og teknologi — med et særlig engasjement for hvordan organisasjoner tar beslutninger.",
    role: "Lead Architect",
    intro: [
      "Jeg jobber som Lead Architect i skjæringspunktet mellom forretning, produkt og teknologi. Etter min erfaring handler arkitektur ikke bare om teknologi — det handler like mye om beslutninger, ansvar, organisasjonsdesign og evnen til å lære.",
      "Et tema som har fulgt meg gjennom hele karrieren, er hvordan organisasjoner faktisk tar beslutninger: hvordan felles kontekst etableres, hvordan antakelser utfordres, hvordan begrunnelser dokumenteres — og hvordan man lærer av valgene i ettertid.",
      "Dette har etter hvert vokst frem til Decision Architecture Framework — et pågående arbeid som springer ut av mange års erfaring med arkitektur, organisasjonsdesign og beslutningsprosesser i komplekse virksomheter.",
    ],
    writeAboutHeading: "Hva jeg skriver om",
    topics: [
      {
        name: "Plattformarkitektur",
        description:
          "Hvordan plattformer skaper autonomi, fart og skalerbarhet i produktorganisasjoner.",
      },
      {
        name: "Virksomhetsarkitektur",
        description:
          "Arkitektur som praktisk verktøy for å koble strategi og gjennomføring — ikke dokumentasjon ingen leser.",
      },
      {
        name: "Beslutningsarkitektur",
        description:
          "Hvordan organisasjoner etablerer kontekst, utfordrer antakelser og lærer av beslutninger over tid.",
      },
      {
        name: "Organisasjonsdesign",
        description:
          "Samspillet mellom struktur, ansvar og tekniske grenser — og hvordan det former resultatene.",
      },
      {
        name: "Produktorienterte driftsmodeller",
        description:
          "Hvordan organisasjoner bygger team, eierskap og verdistrømmer rundt produkter.",
      },
      {
        name: "Styring og beslutningstaking",
        description:
          "Balansen mellom sentral retning og lokal handlefrihet — og hvor beslutningene faktisk bør tas.",
      },
    ],
    contributionsHeading: "Faglige bidrag",
    contributionsIntro:
      "Jeg deler gjerne erfaringer gjennom foredrag, workshops og faglige diskusjoner. Temaer jeg ofte snakker om:",
    contributionTopics: [
      "Plattformarkitektur",
      "Virksomhetsarkitektur",
      "Beslutningsarkitektur",
      "Organisasjonsdesign og produktorientering",
      "Styring og beslutningsprosesser",
    ],
    contact: "Ta kontakt via LinkedIn for faglig dialog eller forespørsler.",
    hubHeading: "Om Hugo Knowledge Hub",
    hubParagraphs: [
      "Hugo Knowledge Hub er en kunnskapsplattform der artikler, observasjoner og rammeverk får utvikle seg over tid. Innholdet er ikke ferdigstilte sannheter, men et pågående arbeid — rammeverk oppdateres, eksempler legges til, og perspektiver modnes etter hvert som erfaringen vokser.",
      "Plattformen finnes fordi varig kunnskap fortjener et varig hjem. Innhold som publiseres i sosiale medier forsvinner i feeden etter noen dager. Her lever artiklene og rammeverkene permanent, med historikk og sammenheng — på tvers av norsk og engelsk.",
      "Decision Architecture Framework er det tydeligste uttrykket for dette: et rammeverk som utvikles åpent, artikkel for artikkel, observasjon for observasjon. LinkedIn brukes til distribusjon og dialog — men den kanoniske versjonen av alt innhold lever her.",
    ],
  },
  en: {
    title: "About",
    description:
      "Hugo Moen is a Lead Architect working at the intersection of business, product and technology — with a particular focus on how organizations make decisions.",
    role: "Lead Architect",
    intro: [
      "I work as a Lead Architect at the intersection of business, product and technology. In my experience, architecture is not only about technology — it is just as much about decisions, accountability, organization design and the ability to learn.",
      "One theme has followed me throughout my career: how organizations actually make decisions — how shared context is established, how assumptions are challenged, how rationale is documented, and how the outcomes are learned from afterwards.",
      "Over time, this grew into the Decision Architecture Framework — an ongoing body of work that emerged naturally from years of experience with architecture, organization design and decision-making in complex enterprises.",
    ],
    writeAboutHeading: "What I write about",
    topics: [
      {
        name: "Platform architecture",
        description:
          "How platforms create autonomy, speed and scale in product organizations.",
      },
      {
        name: "Enterprise architecture",
        description:
          "Architecture as a practical tool for connecting strategy and execution — not documentation nobody reads.",
      },
      {
        name: "Decision architecture",
        description:
          "How organizations establish context, challenge assumptions and learn from decisions over time.",
      },
      {
        name: "Organization design",
        description:
          "The interplay between structure, accountability and technical boundaries — and how it shapes outcomes.",
      },
      {
        name: "Product operating models",
        description:
          "How organizations build teams, ownership and value streams around products.",
      },
      {
        name: "Governance and decision-making",
        description:
          "The balance between central direction and local freedom to act — and where decisions should actually be made.",
      },
    ],
    contributionsHeading: "Professional contributions",
    contributionsIntro:
      "I enjoy sharing experience through talks, workshops and professional discussions. Topics I often speak about:",
    contributionTopics: [
      "Platform architecture",
      "Enterprise architecture",
      "Decision architecture",
      "Organization design and product orientation",
      "Governance and decision processes",
    ],
    contact: "Get in touch via LinkedIn for professional dialogue or inquiries.",
    hubHeading: "About Hugo Knowledge Hub",
    hubParagraphs: [
      "Hugo Knowledge Hub is a knowledge platform where articles, observations and frameworks evolve over time. The content is not a set of finished truths but work in progress — frameworks are updated, examples are added, and perspectives mature as experience grows.",
      "The platform exists because lasting knowledge deserves a lasting home. Content published on social media disappears into the feed within days. Here, articles and frameworks live permanently, with history and context — across Norwegian and English.",
      "The Decision Architecture Framework is the clearest expression of this: a framework developed in the open, article by article, observation by observation. LinkedIn is used for distribution and dialogue — but the canonical version of everything published lives here.",
    ],
  },
};

export function buildAboutMetadata(locale: Locale): Metadata {
  const c = CONTENT[locale];
  const path = localizedPath(locale, "about");
  return {
    title: c.title,
    description: c.description,
    alternates: {
      canonical: path,
      languages: {
        no: localizedPath("no", "about"),
        en: localizedPath("en", "about"),
      },
    },
    openGraph: {
      type: "profile",
      url: path,
      title: `${c.title} Hugo Moen | Hugo Moen`,
      description: c.description,
      locale: locale === "no" ? "nb_NO" : "en_US",
    },
    twitter: {
      card: "summary",
      title: `${c.title} Hugo Moen | Hugo Moen`,
      description: c.description,
    },
  };
}

export default function AboutPage({ locale }: { locale: Locale }) {
  const c = CONTENT[locale];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hugo Moen",
    jobTitle: "Lead Architect",
    url: `${siteUrl}${localizedPath(locale, "about")}`,
    sameAs: ["https://www.linkedin.com/in/hugomoen/"],
    image: `${siteUrl}/images/articles/Hugo Moen Profilbilde.jpg`,
    knowsAbout: c.topics.map((topic) => topic.name),
  };

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="flex flex-col-reverse items-start gap-6 sm:flex-row">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">Hugo Moen</h1>
          <p className="mt-1 text-foreground/50">{c.role}</p>
          {c.intro.map((paragraph) => (
            <p
              key={paragraph.slice(0, 32)}
              className="mt-4 text-foreground/80 leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>
        <Image
          src="/images/articles/Hugo Moen Profilbilde.jpg"
          alt="Hugo Moen"
          width={160}
          height={160}
          className="rounded-full w-28 h-28 sm:w-40 sm:h-40 object-cover"
          priority
        />
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">
          {c.writeAboutHeading}
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {c.topics.map((topic) => (
            <li
              key={topic.name}
              className="rounded-lg border border-foreground/5 px-4 py-3"
            >
              <h3 className="text-sm font-medium">{topic.name}</h3>
              <p className="mt-1 text-sm text-foreground/50 leading-snug">
                {topic.description}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">
          {c.contributionsHeading}
        </h2>
        <p className="mt-4 text-foreground/80 leading-relaxed">
          {c.contributionsIntro}
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-foreground/70">
          {c.contributionTopics.map((topic) => (
            <li key={topic} className="flex items-baseline gap-2">
              <span className="text-foreground/20">&mdash;</span>
              {topic}
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-foreground/60 leading-relaxed">
          {c.contact}
        </p>
        <a
          href="https://www.linkedin.com/in/hugomoen/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-foreground transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
            aria-hidden="true"
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          linkedin.com/in/hugomoen
        </a>
      </section>

      <section className="mt-16">
        <h2 className="text-xl font-semibold tracking-tight">{c.hubHeading}</h2>
        <div className="mt-4 space-y-4 text-foreground/80 leading-relaxed">
          {c.hubParagraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}
