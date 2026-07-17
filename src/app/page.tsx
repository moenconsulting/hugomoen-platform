import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-3xl font-semibold tracking-tight">
        Hugo Moen
      </h1>
      <p className="max-w-lg text-lg leading-relaxed text-foreground/80">
        Velkommen. Her deler jeg artikler, refleksjoner og faglig innhold
        om teknologi, utvikling og ledelse.
      </p>
      <div>
        <Link
          href="/blog"
          className="inline-block rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/80"
        >
          Les artikler
        </Link>
      </div>
    </div>
  );
}
