import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Om",
  description: "Om Hugo Moen.",
};

export default function AboutPage() {
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Om</h1>
      <div className="mt-6 space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Jeg er Hugo Moen. Denne plattformen er mitt personlige rom for
          kunnskapsdeling, refleksjon og faglig innhold.
        </p>
        <p>
          Her publiserer jeg artikler om teknologi, utvikling og ledelse.
          LinkedIn og andre kanaler brukes for distribusjon og synlighet,
          men innholdet bor her.
        </p>
      </div>
    </div>
  );
}
