import type { Metadata } from "next";
import Image from "next/image";
import { siteUrl } from "@/lib/config";

export const metadata: Metadata = {
  title: "Om",
  description:
    "Hugo Moen er Lead Architect med fokus på plattformarkitektur, virksomhetsarkitektur og organisasjonsdesign.",
  alternates: {
    canonical: "/om",
  },
  openGraph: {
    type: "profile",
    url: "/om",
    title: "Om Hugo Moen | Hugo Moen",
    description:
      "Hugo Moen er Lead Architect med fokus på plattformarkitektur, virksomhetsarkitektur og organisasjonsdesign.",
  },
  twitter: {
    card: "summary",
    title: "Om Hugo Moen | Hugo Moen",
    description:
      "Hugo Moen er Lead Architect med fokus på plattformarkitektur, virksomhetsarkitektur og organisasjonsdesign.",
  },
};

const topics = [
  { name: "Plattformarkitektur", description: "Hvordan plattformer kan muliggjøre autonomi og fart i produktteam." },
  { name: "Virksomhetsarkitektur", description: "Arkitektur som styringsverktøy — ikke bare dokumentasjon." },
  { name: "Produktorganisering", description: "Samspillet mellom team, ansvar og tekniske grenser." },
  { name: "Autonomi og styring", description: "Balansen mellom sentral kontroll og lokal handlefrihet." },
  { name: "Beslutningsarkitektur", description: "Hvordan arkitektur påvirker — og forbedrer — beslutninger." },
  { name: "Teknologi og organisasjon", description: "Koblingen mellom tekniske valg og organisatorisk virkelighet." },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Hugo Moen",
    jobTitle: "Lead Architect",
    url: `${siteUrl}/om`,
    sameAs: ["https://www.linkedin.com/in/hugomoen/"],
    image: `${siteUrl}/images/articles/Hugo Moen Profilbilde.jpg`,
    knowsAbout: [
      "Plattformarkitektur",
      "Virksomhetsarkitektur",
      "Beslutningsarkitektur",
      "Organisasjonsdesign",
    ],
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
          <p className="mt-1 text-foreground/50">Lead Architect</p>
          <p className="mt-4 text-foreground/80 leading-relaxed">
            Jeg jobber i skjæringspunktet mellom teknologi, arkitektur og
            organisasjon. Med erfaring fra komplekse virksomheter er jeg
            opptatt av hvordan arkitekturbeslutninger påvirker alt fra
            teamautonomi til forretningsresultater.
          </p>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Jeg tror på arkitektur som et praktisk verktøy for bedre
            beslutninger — ikke som dokumentasjon ingen leser.
          </p>
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
          Hva jeg skriver om
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {topics.map((topic) => (
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
          Faglige bidrag
        </h2>
        <p className="mt-4 text-foreground/80 leading-relaxed">
          Jeg deler gjerne erfaringer gjennom foredrag, workshops og
          faglige diskusjoner. Temaer jeg ofte snakker om:
        </p>
        <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm text-foreground/70">
          <li className="flex items-baseline gap-2">
            <span className="text-foreground/20">&mdash;</span>
            Plattformarkitektur
          </li>
          <li className="flex items-baseline gap-2">
            <span className="text-foreground/20">&mdash;</span>
            Virksomhetsarkitektur
          </li>
          <li className="flex items-baseline gap-2">
            <span className="text-foreground/20">&mdash;</span>
            Beslutningsarkitektur
          </li>
          <li className="flex items-baseline gap-2">
            <span className="text-foreground/20">&mdash;</span>
            Produktorientering og autonomi
          </li>
          <li className="flex items-baseline gap-2">
            <span className="text-foreground/20">&mdash;</span>
            Plattformstyring
          </li>
        </ul>
        <p className="mt-6 text-sm text-foreground/60 leading-relaxed">
          Ta kontakt via LinkedIn for faglig dialog eller forespørsler.
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
        <h2 className="text-xl font-semibold tracking-tight">
          Om Hugo Knowledge Hub
        </h2>
        <div className="mt-4 space-y-4 text-foreground/80 leading-relaxed">
          <p>
            Hugo Knowledge Hub er min personlige plattform for
            kunnskapsdeling. Her publiserer jeg artikler, refleksjoner og
            faglig innhold — som regel med utgangspunkt i erfaringer fra
            praksis.
          </p>
          <p>
            Plattformen finnes fordi jeg ønsker å eie det jeg skriver.
            Innhold som publiseres på LinkedIn eller andre kanaler
            forsvinner i feeden. Her bor artiklene permanent, i et format
            jeg kontrollerer.
          </p>
          <p>
            LinkedIn brukes for distribusjon og synlighet. Men den
            kanoniske versjonen av alt innhold lever her.
          </p>
        </div>
      </section>
    </div>
  );
}
