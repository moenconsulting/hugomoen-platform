import type { Metadata } from "next";
import Link from "next/link";
import { getAllFrameworks, getStatusLabel } from "@/lib/frameworks";

export const metadata: Metadata = {
  title: "Rammeverk",
  description:
    "Rammeverk og modeller for arkitektur, styring og beslutninger.",
};

export default function FrameworksPage() {
  const frameworks = getAllFrameworks();

  if (frameworks.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Rammeverk</h1>
        <p className="mt-2 text-foreground/60">
          Modeller og rammeverk for arkitektur, styring og beslutninger.
        </p>
        <p className="mt-8 text-sm text-foreground/40">
          Ingen rammeverk publisert ennå.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Rammeverk</h1>
      <p className="mt-2 text-foreground/60">
        Modeller og rammeverk for arkitektur, styring og beslutninger.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {frameworks.map((fw) => (
          <li key={fw.slug}>
            <Link
              href={`/frameworks/${fw.slug}`}
              className="block rounded-lg border border-foreground/5 px-4 py-4 hover:border-foreground/15 transition-colors"
            >
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-medium">{fw.title}</h2>
                {fw.status !== "published" && (
                  <span className="rounded-full bg-foreground/5 px-2 py-0.5 text-xs text-foreground/50">
                    {getStatusLabel(fw.status)}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm text-foreground/50 leading-snug">
                {fw.description}
              </p>
              <p className="mt-2 text-xs text-foreground/40">
                {fw.readingTime} min lesetid
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
