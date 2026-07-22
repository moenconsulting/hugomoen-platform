import FrameworksListPage, {
  buildFrameworksListMetadata,
} from "@/components/pages/frameworks-list-page";

export const metadata = buildFrameworksListMetadata("no");

export default function Page() {
  return <FrameworksListPage locale="no" />;
}
