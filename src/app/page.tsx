import Image from "next/image";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";

export default function Home() {
  const articles = getAllArticles().slice(0, 5);

  return (
    <div>
      <section className="flex flex-col-reverse items-start gap-8 sm:flex-row sm:items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-semibold tracking-tight">
            Hugo Knowledge Hub
          </h1>
          <p className="mt-3 max-w-md text-lg leading-relaxed text-foreground/70">
            Artikler, refleksjoner og faglig innhold om teknologi, utvikling
            og ledelse.
          </p>
          <Link
            href="/blog"
            className="mt-6 inline-block rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
          >
            Alle artikler
          </Link>
        </div>
        <Image
          src="/images/articles/Hugo Moen Profilbilde.jpg"
          alt="Hugo Moen"
          width={160}
          height={160}
          className="rounded-full w-32 h-32 sm:w-40 sm:h-40 object-cover"
          priority
        />
      </section>

      {articles.length > 0 && (
        <section className="mt-16">
          <h2 className="text-lg font-semibold tracking-tight text-foreground/50 uppercase text-xs">
            Siste artikler
          </h2>
          <ul className="mt-4 flex flex-col divide-y divide-foreground/5">
            {articles.map((article) => (
              <li key={article.slug} className="py-4 first:pt-0 last:pb-0">
                <article className="flex gap-4">
                  <div className="shrink-0 w-[80px] h-[52px] rounded bg-foreground/5 overflow-hidden">
                    {article.heroImage && (
                      <Image
                        src={article.heroImage}
                        alt=""
                        width={80}
                        height={52}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-foreground/40">
                      <time dateTime={article.date}>{article.date}</time>
                      <span> · {article.readingTime} min</span>
                    </div>
                    <h3 className="text-sm font-medium leading-snug">
                      <Link
                        href={`/blog/${article.slug}`}
                        className="hover:underline underline-offset-4"
                      >
                        {article.title}
                      </Link>
                    </h3>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
