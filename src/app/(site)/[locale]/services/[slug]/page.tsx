import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import NotFoundView from "@/components/NotFoundView";
import ServiceIcon from "@/components/ServiceIcon";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getServiceBySlug, getServiceList } from "@/lib/cms/services";
import { buildMetadata } from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const service = await getServiceBySlug(locale, slug);
  if (!service) return { robots: { index: false, follow: false } };
  return buildMetadata({
    title: `${service.title} | Media Planner Consultant`,
    description: service.summary,
    path: `/${locale}/services/${slug}`,
    image: service.image,
  });
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { services } = dict;
  const service = await getServiceBySlug(locale, slug);
  if (!service) {
    return (
      <ContentSheet>
        <NotFoundView locale={locale} dict={dict} />
      </ContentSheet>
    );
  }

  const otherServices = (await getServiceList(locale)).filter((item) => item.slug !== slug);

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: services.listTitle, href: `/${locale}/services` },
          { label: service.title },
        ]}
        title={service.title}
      />

      <section className={styles.detail}>
        <div className={styles.detailImage}>
          <Image
            src={service.image}
            alt={service.title}
            fill
            sizes="(max-width: 780px) 100vw, 50vw"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div className={styles.detailBody}>
          <ServiceIcon slug={service.slug} gradient={service.gradient} className={styles.icon} size={24} />
          <div
            className={styles.description}
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
          />
          <h2 className={styles.highlightsTitle}>{services.highlightsTitle}</h2>
          <ul className={styles.highlights}>
            {service.highlights.map((highlight) => (
              <li key={highlight} className={styles.highlightItem}>
                <span className={styles.highlightDot} />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
          <div className={styles.ctaRow}>
            <Link href={`/${locale}/contact`} className={styles.ctaButton}>
              {services.ctaButton}
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.related}>
        <h2 className={styles.relatedTitle}>{services.relatedTitle}</h2>
        <div className={styles.relatedGrid}>
          {otherServices.map((item) => (
            <Link
              key={item.slug}
              href={`/${locale}/services/${item.slug}`}
              className={styles.relatedCard}
            >
              <ServiceIcon slug={item.slug} gradient={item.gradient} className={styles.relatedIcon} size={18} />
              <span className={styles.relatedCardTitle}>{item.title}</span>
              <span className={styles.relatedCardSummary}>{item.summary}</span>
            </Link>
          ))}
        </div>
      </section>
    </ContentSheet>
  );
}
