import type { Metadata } from "next";
import Link from "next/link";
import { getAllTopics } from "@/lib/topics";

export const metadata: Metadata = {
  title: "Emner",
  description:
    "Utforsk artikler etter emne — arkitektur, ledelse, strategi og mer.",
};

export default function TopicsPage() {
  const topics = getAllTopics();

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Emner</h1>
      <p className="mt-2 text-foreground/60">
        Utforsk artikler etter emne.
      </p>

      <ul className="mt-8 grid gap-4 sm:grid-cols-2">
        {topics.map((topic) => (
          <li key={topic.slug}>
            <Link
              href={`/emner/${topic.slug}`}
              className="block rounded-lg border border-foreground/5 px-4 py-4 hover:border-foreground/15 transition-colors"
            >
              <h2 className="text-sm font-medium">{topic.name}</h2>
              {topic.description && (
                <p className="mt-1 text-sm text-foreground/50 leading-snug">
                  {topic.description}
                </p>
              )}
              <p className="mt-2 text-xs text-foreground/40">
                {topic.articleCount}{" "}
                {topic.articleCount === 1 ? "artikkel" : "artikler"}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
