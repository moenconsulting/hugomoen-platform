import TopicsListPage, {
  buildTopicsListMetadata,
} from "@/components/pages/topics-list-page";

export const metadata = buildTopicsListMetadata("en");

export default function Page() {
  return <TopicsListPage locale="en" />;
}
