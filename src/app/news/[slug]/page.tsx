import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getNewsBySlug, getNewsItems } from "@/lib/site-content";
import NewsArticleClient from "./NewsArticleClient";

export async function generateStaticParams() {
  const items = await getNewsItems();
  return items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getNewsBySlug(slug);

  if (!item) {
    return { title: "Dispatch Not Found | Plane Architect" };
  }

  return {
    title: `${item.title} | Plane Architect`,
    description: item.excerpt,
    openGraph: {
      title: `${item.title} | Plane Architect`,
      description: item.excerpt,
      images: [{ url: item.image }],
    },
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [item, newsItems] = await Promise.all([getNewsBySlug(slug), getNewsItems()]);

  if (!item) notFound();

  return (
    <NewsArticleClient
      item={item}
      relatedItems={newsItems.filter((newsItem) => newsItem.id !== item.id).slice(0, 3)}
    />
  );
}