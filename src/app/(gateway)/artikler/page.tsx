import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";

export const metadata = buildLegacyRedirectMetadata("/no/artikler");

export default function Page() {
  return <LegacyRedirect to="/no/artikler" />;
}
