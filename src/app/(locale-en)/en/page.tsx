import HomePage, { buildHomeMetadata } from "@/components/pages/home-page";

export const metadata = buildHomeMetadata("en");

export default function Page() {
  return <HomePage locale="en" />;
}
