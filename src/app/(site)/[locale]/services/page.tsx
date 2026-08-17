import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import ServiceIcon from "@/components/ServiceIcon";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getServiceList } from "@/lib/cms/services";

export const dynamic = "force-dynamic";

const DESCRIPTION_LIMIT = 200;

function toPlainText(html: string): string {
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&[#\w]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function truncateText(text: string, limit = DESCRIPTION_LIMIT): string {
  if (text.length <= limit) return text;
  return `${text.slice(0, limit).trimEnd()}...`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.services.listTitle} | Media Planner Consultant` };
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { services } = dict;
  const serviceList = await getServiceList();

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[
          { label: dict.common.home, href: `/${locale}` },
          { label: services.listTitle },
        ]}
        title={services.listTitle}
      />

      <div className={styles.overview}>
        <picture>
          <source media="(min-width: 721px)" srcSet="/images/services-overview5.png" />
          <img
            src="/images/services-overview4.png"
            alt={services.listTitle}
            className={styles.overviewImage}
            loading="eager"
          />
        </picture>
      </div>

      {serviceList.map((service, index) => {
        const imageFirst = index % 2 === 1;
        return (
          <section key={service.slug} className={styles.row}>
            <div
              className={`${styles.textCol} ${imageFirst ? styles.textColReversed : ""}`}
            >
              <div className={styles.serviceHead}>
                <ServiceIcon
                  icon={service.icon}
                  gradient={service.gradient}
                  className={styles.icon}
                />
                <h2 className={styles.title}>{service.title}</h2>
              </div>
              <p className={styles.desc}>
                {truncateText(
                  toPlainText(DOMPurify.sanitize(service.description)),
                )}
              </p>
              <Link
                href={`/${locale}/services/${service.slug}`}
                className={styles.link}
              >
                {services.viewDetailLink}
              </Link>
            </div>
            <div className={`${styles.imageCol} ${imageFirst ? styles.imageColFirst : ""}`}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 720px) 100vw, 420px"
                style={{ objectFit: "cover" }}
              />
            </div>
          </section>
        );
      })}
    </ContentSheet>
  );
}
