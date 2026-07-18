import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Artikler",
  description: "Artikler om teknologi, utvikling og ledelse.",
};

export default function ArticlesPage() {
  const articles = getAllArticles();

  if (articles.length === 0) {
    return (
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Artikler</h1>
        <p className="mt-4 text-foreground/60">
          Ingen artikler publisert ennå.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-tight">Artikler</h1>
      <ul className="mt-8 flex flex-col divide-y divide-foreground/5">
        {articles.map((article) => (
          <li key={article.slug} className="py-5 first:pt-0 last:pb-0">
            <article className="flex gap-4">
              <Link
                href={`/artikler/${article.slug}`}
                className="shrink-0 w-[100px] h-[64px] rounded bg-foreground/5 overflow-hidden"
              >
                {article.heroImage && (
                  <Image
                    src={article.heroImage}
                    alt=""
                    width={100}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                )}
              </Link>
              <div className="min-w-0">
                <div className="text-sm text-foreground/50">
                  <time dateTime={article.date}>{article.date}</time>
                  <span> · {article.readingTime} min</span>
                </div>
                <h2 className="mt-0.5 text-lg font-medium leading-snug">
                  <Link
                    href={`/artikler/${article.slug}`}
                    className="hover:underline underline-offset-4"
                  >
                    {article.title}
                  </Link>
                </h2>
                <p className="mt-0.5 text-sm text-foreground/60 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
