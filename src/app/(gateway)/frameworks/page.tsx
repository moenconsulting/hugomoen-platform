import LegacyRedirect, {
  buildLegacyRedirectMetadata,
} from "@/components/legacy-redirect";

export const metadata = buildLegacyRedirectMetadata("/en/frameworks");

export default function Page() {
  return <LegacyRedirect to="/en/frameworks" />;
}
