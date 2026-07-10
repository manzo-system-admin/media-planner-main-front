import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ContentSheet from "@/components/ContentSheet";
import ClientLogo from "@/components/ClientLogo";
import styles from "./page.module.css";
import PortfolioExplorer from "./PortfolioExplorer";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getPortfolioCategories, getPortfolioCategoryLabels, getPortfolioList } from "@/lib/cms/portfolio";
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
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const dict = getDictionary(locale);
  const { portfolio } = dict;
  const items = await getPortfolioList(locale);
  const fetchedLabels = await getPortfolioCategoryLabels(locale);
  const categoryLabels = { ...portfolio.categoryLabels, ...fetchedLabels };
  const fetchedCategories = await getPortfolioCategories(locale);
  const filters =
    fetchedCategories.length > 0
      ? [{ key: "ALL", label: dict.common.all }, ...fetchedCategories]
      : portfolio.filters;
  const clients = await getClients();

  return (
    <ContentSheet>
      <PortfolioExplorer
        locale={locale}
        homeLabel={dict.common.home}
        portfolio={portfolio}
        filters={filters}
        categoryLabels={categoryLabels}
        items={items}
      />

      <section className={styles.clients}>
        <div className={styles.clientsLabel}>{portfolio.clientsLabel}</div>
        <div className={styles.clientsRow}>
          {clients.map((client, index) => (
            <div key={client.name} className={styles.clientLogo}>
              <ClientLogo name={client.name} index={index} logoUrl={client.logoUrl} />
            </div>
          ))}
        </div>
      </section>
    </ContentSheet>
  );
}
