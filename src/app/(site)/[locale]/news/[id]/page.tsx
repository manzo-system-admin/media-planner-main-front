import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import NotFoundView from "@/components/NotFoundView";
import NewsHeroImage from "@/components/NewsHeroImage";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getNewsById, getNewsCategoryLabels, getNewsList } from "@/lib/cms/news";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!isLocale(locale)) return {};
  const item = await getNewsById(locale, id);
  if (!item) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${item.title} | Media Planner Consultant`,
    description: item.excerpt,
    path: `/${locale}/news/${id}`,
    image: item.image,
    type: "article",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { news } = dict;
  const item = await getNewsById(locale, id);
  if (!item) {
    return (
      <ContentSheet>
        <NotFoundView locale={locale} dict={dict} />
      </ContentSheet>
    );
  }

  const allNews = await getNewsList(locale);
  const related = allNews.filter((entry) => entry.id !== id).slice(0, 3);
  const safeBody = DOMPurify.sanitize(item.bodyHtml);
  const categoryLabels = await getNewsCategoryLabels();
  const categoryLabel = item.category ? categoryLabels[item.category] : undefined;

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: news.title, href: `/${locale}/news` },
          { label: item.title },
        ]}
        title={item.title}
      >
        {categoryLabel && <span className={styles.category}>{categoryLabel}</span>}
        <span className={styles.date}>{item.date}</span>
      </PageIntro>

      <section className={styles.heroSection}>
        <NewsHeroImage src={item.image} alt={item.title} />
      </section>

      <section
        className={styles.body}
        // Sanitized above with isomorphic-dompurify; content is admin-authored,
        // not raw visitor input, but still passes through DOMPurify defensively.
        dangerouslySetInnerHTML={{ __html: safeBody }}
      />

      {related.length > 0 && (
        <section className={styles.related}>
          <h2 className={styles.relatedTitle}>{news.relatedTitle}</h2>
          <div className={styles.relatedGrid}>
            {related.map((entry) => (
              <Link key={entry.id} href={`/${locale}/news/${entry.id}`} className={styles.relatedCard}>
                <div className={styles.relatedImage}>
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    sizes="(max-width: 780px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={styles.relatedBody}>
                  <span className={styles.relatedDate}>{entry.date}</span>
                  <span className={styles.relatedCardTitle}>{entry.title}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </ContentSheet>
  );
}
