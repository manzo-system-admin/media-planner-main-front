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
        breadcrumb={[{ label: dict.common.home, href: `/${locale}` }, { label: services.listTitle }]}
        title={services.listTitle}
      />

      <div className={styles.overview}>
        <Image
          src="/images/services-overview.png"
          alt={services.listTitle}
          width={1536}
          height={1024}
          sizes="(max-width: 900px) 100vw, 900px"
          className={styles.overviewImage}
          priority
        />
      </div>

      {serviceList.map((service, index) => {
        const imageFirst = index % 2 === 1;
        return (
          <section key={service.slug} className={styles.row}>
            <div className={`${styles.textCol} ${imageFirst ? styles.textColReversed : ""}`}>
              <ServiceIcon icon={service.icon} gradient={service.gradient} className={styles.icon} />
              <h2 className={styles.title}>{service.title}</h2>
              <div
                className={styles.desc}
                dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(service.description) }}
              />
              <Link href={`/${locale}/services/${service.slug}`} className={styles.link}>
                {services.viewDetailLink}
              </Link>
            </div>
            <div className={styles.imageCol}>
              <Image
                src={service.image}
                alt={service.title}
                fill
                sizes="(max-width: 720px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
            </div>
          </section>
        );
      })}
    </ContentSheet>
  );
}
