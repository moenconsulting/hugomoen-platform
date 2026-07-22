import HomePage, { buildHomeMetadata } from "@/components/pages/home-page";

export const metadata = buildHomeMetadata("no");

export default function Page() {
  return <HomePage locale="no" />;
}
