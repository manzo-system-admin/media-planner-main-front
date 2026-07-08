import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import NotFoundView from "@/components/NotFoundView";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPortfolioBySlug, getPortfolioCategoryLabels, getPortfolioList } from "@/lib/cms/portfolio";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const item = await getPortfolioBySlug(locale, slug);
  if (!item) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${item.title} | Media Planner Consultant`,
    description: item.result,
    path: `/${locale}/portfolio/${slug}`,
    image: item.image,
  });
}

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { portfolio } = dict;
  const item = await getPortfolioBySlug(locale, slug);
  if (!item) {
    return (
      <ContentSheet>
        <NotFoundView locale={locale} dict={dict} />
      </ContentSheet>
    );
  }

  const allItems = await getPortfolioList(locale);
  const fetchedLabels = await getPortfolioCategoryLabels(locale);
  const categoryLabels = { ...portfolio.categoryLabels, ...fetchedLabels };

  const related = allItems
    .filter((entry) => entry.slug !== slug && entry.category === item.category)
    .concat(allItems.filter((entry) => entry.slug !== slug && entry.category !== item.category))
    .slice(0, 3);

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: portfolio.title, href: `/${locale}/portfolio` },
          { label: item.title },
        ]}
        title={item.title}
      >
        <div className={styles.metaRow}>
          <span className={styles.categoryBadge}>{categoryLabels[item.category]}</span>
          <span className={styles.client}>
            {portfolio.clientLabel}: {item.client}
          </span>
        </div>
      </PageIntro>

      <section className={styles.heroSection}>
        <div className={styles.heroImage}>
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
          />
        </div>
      </section>

      <section className={styles.statsSection}>
        {item.stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </section>

      <section className={styles.story}>
        <div className={styles.storyBlock}>
          <span className={styles.storyLabel}>{portfolio.challengeLabel}</span>
          <p className={styles.storyText}>{item.challenge}</p>
        </div>
        <div className={styles.storyBlock}>
          <span className={styles.storyLabel}>{portfolio.approachLabel}</span>
          <p className={styles.storyText}>{item.approach}</p>
        </div>
        <div className={styles.storyBlock}>
          <span className={styles.storyLabel}>{portfolio.resultLabel}</span>
          <p className={styles.storyText}>{item.result}</p>
        </div>
      </section>

      <section className={styles.related}>
        <h2 className={styles.relatedTitle}>{portfolio.relatedTitle}</h2>
        <div className={styles.relatedGrid}>
          {related.map((entry) => (
            <Link
              key={entry.slug}
              href={`/${locale}/portfolio/${entry.slug}`}
              className={styles.relatedCard}
            >
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
                <div className={styles.relatedCategory}>{categoryLabels[entry.category]}</div>
                <div className={styles.relatedCardTitle}>{entry.title}</div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </ContentSheet>
  );
}
