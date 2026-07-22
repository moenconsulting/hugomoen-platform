import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";

export const metadata = buildLegacyRedirectMetadata("/no/rammeverk");

export default function Page() {
  return <LegacyRedirect to="/no/rammeverk" />;
}
