import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Blogg",
  description: "Artikler om teknologi, utvikling og ledelse.",
};

export default function BlogPage() {
  const articles = getAllArticles();

  if (articles.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Blogg</h1>
        <p className="mt-4 text-foreground/60">
          Ingen artikler publisert ennå.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Blogg</h1>
      <ul className="mt-8 flex flex-col gap-8">
        {articles.map((article) => (
          <li key={article.slug}>
            <article>
              <time
                dateTime={article.date}
                className="text-sm text-foreground/50"
              >
                {article.date}
              </time>
              <h2 className="mt-1 text-xl font-medium">
                <Link
                  href={`/blog/${article.slug}`}
                  className="hover:underline underline-offset-4"
                >
                  {article.title}
                </Link>
              </h2>
              <p className="mt-1 text-foreground/70">
                {article.description}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
