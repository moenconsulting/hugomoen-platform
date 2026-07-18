import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config";
import { getListingArticles } from "@/lib/articles";
import { getAllFrameworks } from "@/lib/frameworks";
import { getAllTopicSlugs } from "@/lib/topics";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getListingArticles();
  const frameworks = getAllFrameworks();
  const topicSlugs = getAllTopicSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/artikler`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/frameworks`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/emner`,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${siteUrl}/om`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  const articlePages: MetadataRoute.Sitemap = articles.map((article) => ({
    url: `${siteUrl}/artikler/${article.slug}`,
    lastModified: article.date,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const frameworkPages: MetadataRoute.Sitemap = frameworks.map((fw) => ({
    url: `${siteUrl}/frameworks/${fw.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const topicPages: MetadataRoute.Sitemap = topicSlugs.map((slug) => ({
    url: `${siteUrl}/emner/${slug}`,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  return [...staticPages, ...articlePages, ...frameworkPages, ...topicPages];
}
