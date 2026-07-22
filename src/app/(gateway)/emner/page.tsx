import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";

export const metadata = buildLegacyRedirectMetadata("/no/emner");

export default function Page() {
  return <LegacyRedirect to="/no/emner" />;
}
