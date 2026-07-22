import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";

export const metadata = buildLegacyRedirectMetadata("/no/om");

export default function Page() {
  return <LegacyRedirect to="/no/om" />;
}
