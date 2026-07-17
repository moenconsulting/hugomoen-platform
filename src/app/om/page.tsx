import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Om",
  description: "Om Hugo Moen.",
};

export default function AboutPage() {
  return (
    <div>
      <div className="flex flex-col-reverse items-start gap-6 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">Om</h1>
          <p className="mt-3 text-foreground/80 leading-relaxed">
            Jeg er Hugo Moen. Denne plattformen er mitt personlige rom for
            kunnskapsdeling, refleksjon og faglig innhold.
          </p>
        </div>
        <Image
          src="/images/articles/Hugo Moen Profilbilde.jpg"
          alt="Hugo Moen"
          width={128}
          height={128}
          className="rounded-full w-24 h-24 sm:w-32 sm:h-32 object-cover"
          priority
        />
      </div>
      <div className="mt-8 space-y-4 text-foreground/80 leading-relaxed">
        <p>
          Her publiserer jeg artikler om teknologi, utvikling og ledelse.
          LinkedIn og andre kanaler brukes for distribusjon og synlighet,
          men innholdet bor her.
        </p>
      </div>
    </div>
  );
}
