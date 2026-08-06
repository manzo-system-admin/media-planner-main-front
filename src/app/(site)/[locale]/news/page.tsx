import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import NewsTabs from "./NewsTabs";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getNewsCategories, getNewsCategoryLabels, getNewsList } from "@/lib/cms/news";
import { getEventGallery, getVideoLibrary } from "@/lib/cms/media";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.news.title} | Media Planner Consultant` };
}

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const newsItems = await getNewsList(locale);
  const videoLibrary = await getVideoLibrary();
  const eventGallery = await getEventGallery();
  const categories = await getNewsCategories();
  const categoryLabels = await getNewsCategoryLabels();

  return (
    <ContentSheet>
      <NewsTabs
        locale={locale}
        homeLabel={dict.common.home}
        news={dict.news}
        allLabel={dict.common.all}
        newsItems={newsItems}
        videoLibrary={videoLibrary}
        eventGallery={eventGallery}
        categories={categories}
        categoryLabels={categoryLabels}
      />
    </ContentSheet>
  );
}
