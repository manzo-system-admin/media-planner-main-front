"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientLogo from "./ClientLogo";
import panelStyles from "./ClientDetailPanel.module.css";
import type { PortfolioItem } from "@/lib/dictionaries/types";
import type { ClientCategory } from "@/lib/cms/clientCategories";
import type { Locale } from "@/lib/i18n/config";

type ClientsStyles = {
  readonly [key: string]: string;
};

type ClientEntry = { id: string; name: string; category?: ClientCategory; logoUrl?: string };
type ClientCategoryFilter = ClientCategory | "all";

const CLIENT_CATEGORY_FILTERS: { key: ClientCategoryFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pr", label: "PR/IR" },
  { key: "ipo", label: "IPO" },
];

export default function ClientsSection({
  label,
  clients,
  styles,
  locale,
  portfolioItems,
  detailLabels,
  scroll = true,
  linkToPortfolio = false,
  initialClientId,
}: {
  label: string;
  clients: ClientEntry[];
  styles: ClientsStyles;
  locale?: Locale;
  portfolioItems?: PortfolioItem[];
  detailLabels?: { viewCaseStudy: string; empty: string; closeLabel: string };
  /** Marquee auto-scroll (default) vs a static wrapped grid showing every client. */
  scroll?: boolean;
  /** Clicking a client navigates to /portfolio?client=id instead of opening an in-place panel. */
  linkToPortfolio?: boolean;
  /** Pre-opens this client's panel on mount, used when arriving from the home page's marquee. */
  initialClientId?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<ClientCategoryFilter>("all");
  const [activeClient, setActiveClient] = useState<ClientEntry | null>(() =>
    initialClientId ? (clients.find((client) => client.id === initialClientId) ?? null) : null
  );
  const sectionRef = useRef<HTMLElement>(null);
  const filteredClients =
    activeCategory === "all" ? clients : clients.filter((client) => client.category === activeCategory);
  // Duplicated so the marquee track can loop seamlessly at -50% translateX.
  const displayed = scroll && filteredClients.length > 0 ? [...filteredClients, ...filteredClients] : filteredClients;

  const interactive = !linkToPortfolio && !!portfolioItems && !!locale && !!detailLabels;
  const relatedItems =
    activeClient && portfolioItems
      ? portfolioItems.filter((item) => item.clientId === activeClient.id)
      : [];

  const toggleClient = (client: ClientEntry) => {
    setActiveClient((current) => (current?.id === client.id ? null : client));
  };

  const closeClient = () => setActiveClient(null);

  useEffect(() => {
    if (!initialClientId) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialClientId]);

  useEffect(() => {
    if (!activeClient) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeClient();
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [activeClient]);

  return (
    <section className={styles.clients} ref={sectionRef}>
      <div className={styles.clientsHeader}>
        <div className={styles.clientsLabel}>{label}</div>
        {!scroll && (
          <>
            <div className={styles.clientsCategoryButtons} aria-label="Client category">
              {CLIENT_CATEGORY_FILTERS.map((filter) => (
                <button
                  key={filter.key}
                  type="button"
                  className={`${styles.clientsCategoryButton} ${
                    activeCategory === filter.key ? styles.clientsCategoryButtonActive : ""
                  }`}
                  aria-pressed={activeCategory === filter.key}
                  onClick={() => {
                    setActiveCategory(filter.key);
                    closeClient();
                  }}
                >
                  {filter.label}
                </button>
              ))}
            </div>

            <label className={styles.clientsFilter}>
              <span className={styles.clientsFilterText}>หมวดหมู่</span>
              <select
                className={styles.clientsSelect}
                value={activeCategory}
                onChange={(event) => {
                  setActiveCategory(event.target.value as ClientCategoryFilter);
                  closeClient();
                }}
              >
                {CLIENT_CATEGORY_FILTERS.map((filter) => (
                  <option key={filter.key} value={filter.key}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
      </div>

      {scroll ? (
        <div className={styles.clientsViewport}>
          <div className={styles.clientsRow}>
            {displayed.map((client, index) => (
              <ClientTile
                key={`${client.id}-${index}`}
                client={client}
                index={index}
                className={styles.clientLogo}
                interactive={interactive}
                active={activeClient?.id === client.id}
                linkToPortfolio={linkToPortfolio}
                locale={locale}
                onToggle={toggleClient}
              />
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.clientsGrid}>
          {displayed.map((client, index) => (
            <ClientTile
              key={client.id}
              client={client}
              index={index}
              className={styles.clientLogo}
              interactive={interactive}
              active={activeClient?.id === client.id}
              linkToPortfolio={linkToPortfolio}
              locale={locale}
              onToggle={toggleClient}
            />
          ))}
        </div>
      )}

      {interactive && activeClient && (
        <div className={panelStyles.modalBackdrop} role="presentation" onMouseDown={closeClient}>
          <div
            className={panelStyles.modal}
            role="dialog"
            aria-modal="true"
            aria-label={activeClient.name}
            onMouseDown={(event) => event.stopPropagation()}
          >
            <div className={panelStyles.header}>
              <ClientLogo name={activeClient.name} index={0} logoUrl={activeClient.logoUrl} />
              <button
                type="button"
                className={panelStyles.closeButton}
                aria-label={detailLabels!.closeLabel}
                onClick={closeClient}
              >
                x
              </button>
            </div>

            {relatedItems.length === 0 ? (
              <p className={panelStyles.empty}>{detailLabels!.empty}</p>
            ) : (
              <div className={panelStyles.list}>
                {relatedItems.map((item) => (
                  <Link
                    key={item.id}
                    href={`/${locale}/portfolio/${item.id}`}
                    className={panelStyles.item}
                  >
                    <div className={panelStyles.itemImage}>
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 720px) 42vw, 220px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                    <div className={panelStyles.itemBody}>
                      <span className={panelStyles.itemTitle}>{item.title}</span>
                      <span className={panelStyles.itemLink}>{detailLabels!.viewCaseStudy}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

function ClientTile({
  client,
  index,
  className,
  interactive,
  active,
  linkToPortfolio,
  locale,
  onToggle,
}: {
  client: ClientEntry;
  index: number;
  className: string;
  interactive: boolean;
  active: boolean;
  linkToPortfolio: boolean;
  locale?: Locale;
  onToggle: (client: ClientEntry) => void;
}) {
  if (linkToPortfolio && locale) {
    return (
      <Link href={`/${locale}/portfolio?client=${client.id}`} className={className}>
        <ClientLogo name={client.name} index={index} logoUrl={client.logoUrl} />
      </Link>
    );
  }

  if (interactive) {
    return (
      <button
        type="button"
        className={className}
        style={{ border: "none", font: "inherit", cursor: "pointer" }}
        aria-expanded={active}
        onClick={() => onToggle(client)}
      >
        <ClientLogo name={client.name} index={index} logoUrl={client.logoUrl} />
      </button>
    );
  }

  return (
    <div className={className}>
      <ClientLogo name={client.name} index={index} logoUrl={client.logoUrl} />
    </div>
  );
}
