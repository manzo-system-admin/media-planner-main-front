import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import ClientsSection from "@/components/ClientsSection";
import styles from "./page.module.css";
// import PortfolioExplorer from "./PortfolioExplorer";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPortfolioList } from "@/lib/cms/portfolio";
import { getClients } from "@/lib/cms/org";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.portfolio.title} | Media Planner Consultant` };
}

export default async function PortfolioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ client?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const { client: initialClientId } = await searchParams;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { portfolio } = dict;
  const items = await getPortfolioList();
  const clients = await getClients();
  // const filters =
  //   clients.length > 0
  //     ? [{ key: "ALL", label: dict.common.all }, ...clients.map((c) => ({ key: c.id, label: c.name }))]
  //     : portfolio.filters;

  return (
    <ContentSheet>
      {/* <PortfolioExplorer
        locale={locale}
        homeLabel={dict.common.home}
        portfolio={portfolio}
        filters={filters}
        items={items}
      /> */}
      <div className={styles.intro}>
        <h1 className={styles.title}>{portfolio.title}</h1>
        <ClientsSection
          label={portfolio.clientsLabel}
          clients={clients}
          styles={styles}
          locale={locale}
          portfolioItems={items}
          detailLabels={{
            viewCaseStudy: portfolio.viewCaseStudy,
            empty: portfolio.clientDrawerEmpty,
            closeLabel: portfolio.closeLabel,
          }}
          scroll={false}
          initialClientId={initialClientId}
        />
      </div>
    </ContentSheet>
  );
}
