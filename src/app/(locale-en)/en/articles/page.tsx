import ArticlesListPage, {
  buildArticlesListMetadata,
} from "@/components/pages/articles-list-page";

export const metadata = buildArticlesListMetadata("en");

export default function Page() {
  return <ArticlesListPage locale="en" />;
}
