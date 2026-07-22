import AboutPage, { buildAboutMetadata } from "@/components/pages/about-page";

export const metadata = buildAboutMetadata("en");

export default function Page() {
  return <AboutPage locale="en" />;
}
