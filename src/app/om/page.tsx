import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Om",
  description:
    "Hugo Moen er Lead Architect med fokus på plattformarkitektur, virksomhetsarkitektur og organisasjonsdesign.",
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
  return (
    <div>
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
