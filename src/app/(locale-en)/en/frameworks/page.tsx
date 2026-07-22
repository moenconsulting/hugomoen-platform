import FrameworksListPage, {
  buildFrameworksListMetadata,
} from "@/components/pages/frameworks-list-page";

export const metadata = buildFrameworksListMetadata("en");

export default function Page() {
  return <FrameworksListPage locale="en" />;
}
