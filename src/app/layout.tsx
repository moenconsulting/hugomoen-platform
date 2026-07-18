import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { Geist } from "next/font/google";
import Link from "next/link";
import { siteUrl } from "@/lib/config";
import MobileNav from "@/components/mobile-nav";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hugo Moen",
    template: "%s | Hugo Moen",
  },
  description:
    "Artikler, refleksjoner og faglig innhold fra Hugo Moen.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: "website",
    locale: "nb_NO",
    siteName: "Hugo Knowledge Hub",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">
        <header className="border-b border-foreground/10">
          <nav className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-lg font-semibold">
              Hugo Moen
            </Link>
            <ul className="hidden sm:flex gap-6 text-sm">
              <li>
                <Link
                  href="/artikler"
                  className="hover:underline underline-offset-4"
                >
                  Artikler
                </Link>
              </li>
              <li>
                <Link
                  href="/frameworks"
                  className="hover:underline underline-offset-4"
                >
                  Rammeverk
                </Link>
              </li>
              <li>
                <Link
                  href="/emner"
                  className="hover:underline underline-offset-4"
                >
                  Emner
                </Link>
              </li>
              <li>
                <Link
                  href="/om"
                  className="hover:underline underline-offset-4"
                >
                  Om
                </Link>
              </li>
            </ul>
            <MobileNav />
          </nav>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
          {children}
        </main>

        <footer className="border-t border-foreground/10">
          <div className="mx-auto max-w-3xl px-6 py-6 text-sm text-foreground/60">
            &copy; {new Date().getFullYear()} Hugo Moen
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
