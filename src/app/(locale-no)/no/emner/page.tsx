import TopicsListPage, {
  buildTopicsListMetadata,
} from "@/components/pages/topics-list-page";

export const metadata = buildTopicsListMetadata("no");

export default function Page() {
  return <TopicsListPage locale="no" />;
}
