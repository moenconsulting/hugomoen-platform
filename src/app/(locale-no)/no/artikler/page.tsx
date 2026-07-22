import ArticlesListPage, {
  buildArticlesListMetadata,
} from "@/components/pages/articles-list-page";

export const metadata = buildArticlesListMetadata("no");

export default function Page() {
  return <ArticlesListPage locale="no" />;
}
