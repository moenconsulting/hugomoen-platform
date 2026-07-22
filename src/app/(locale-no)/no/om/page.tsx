import AboutPage, { buildAboutMetadata } from "@/components/pages/about-page";

export const metadata = buildAboutMetadata("no");

export default function Page() {
  return <AboutPage locale="no" />;
}
