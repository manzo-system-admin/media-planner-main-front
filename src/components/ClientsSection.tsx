"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ClientLogo from "./ClientLogo";
import panelStyles from "./ClientDetailPanel.module.css";
import type { PortfolioItem } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

type ClientsStyles = {
  readonly [key: string]: string;
};

type ClientEntry = { id: string; name: string; logoUrl?: string };

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
  /** Pre-opens this client's panel on mount — used when arriving from the home page's marquee. */
  initialClientId?: string;
}) {
  const [activeClient, setActiveClient] = useState<ClientEntry | null>(() =>
    initialClientId ? (clients.find((c) => c.id === initialClientId) ?? null) : null
  );
  const sectionRef = useRef<HTMLElement>(null);
  // Duplicated so the marquee track can loop seamlessly at -50% translateX.
  const displayed = scroll && clients.length > 0 ? [...clients, ...clients] : clients;

  const interactive = !linkToPortfolio && !!portfolioItems && !!locale && !!detailLabels;
  const relatedItems =
    activeClient && portfolioItems
      ? portfolioItems.filter((item) => item.clientId === activeClient.id)
      : [];

  const toggleClient = (client: ClientEntry) => {
    setActiveClient((current) => (current?.id === client.id ? null : client));
  };

  useEffect(() => {
    if (!initialClientId) return;
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [initialClientId]);

  return (
    <section className={styles.clients} ref={sectionRef}>
      <div className={styles.clientsLabel}>{label}</div>
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

      {interactive && (
        <div className={`${panelStyles.wrap} ${activeClient ? panelStyles.wrapOpen : ""}`}>
          <div className={panelStyles.inner}>
            {activeClient && (
              <div className={panelStyles.panel}>
                <div className={panelStyles.header}>
                  <ClientLogo name={activeClient.name} index={0} logoUrl={activeClient.logoUrl} />
                  <button
                    type="button"
                    className={panelStyles.closeButton}
                    aria-label={detailLabels!.closeLabel}
                    onClick={() => setActiveClient(null)}
                  >
                    ✕
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
                            sizes="220px"
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
