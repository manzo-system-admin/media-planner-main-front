import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageIntro from "@/components/PageIntro";
import ContentSheet from "@/components/ContentSheet";
import SocialIcon from "@/components/SocialIcon";
import styles from "./page.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { isLocale } from "@/lib/i18n/config";
import { getSiteSettings } from "@/lib/cms/siteSettings";

export const dynamic = "force-dynamic";

function ContactGlyph({ type }: { type: "address" | "phone" | "email" | "social" }) {
  const paths = {
    address: (
      <>
        <path d="M12 21s7-5.1 7-11a7 7 0 0 0-14 0c0 5.9 7 11 7 11Z" />
        <path d="M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" />
      </>
    ),
    phone: (
      <path d="M6.6 4.8 9 4.2l1.6 4-1.5 1c.8 1.7 2 2.9 3.7 3.7l1-1.5 4 1.6-.6 2.4c-.3 1.1-1.3 1.8-2.4 1.6C8.9 16.1 5 12.1 4 6.2c-.2-1.1.5-2.1 1.6-2.4Z" />
    ),
    email: (
      <>
        <path d="M4 6.5h16v11H4z" />
        <path d="m5 7 7 5.2L19 7" />
      </>
    ),
    social: (
      <>
        <path d="M8.4 12.4 15.6 8" />
        <path d="M8.4 11.6 15.6 16" />
        <path d="M6.5 14a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M17.5 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
        <path d="M17.5 19.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      </>
    ),
  };

  return (
    <span className={`${styles.fieldIcon} ${styles[`fieldIcon${type[0].toUpperCase()}${type.slice(1)}`]}`}>
      <svg viewBox="0 0 24 24" aria-hidden="true">
        {paths[type]}
      </svg>
    </span>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return { title: `${dict.contact.title} | Media Planner Consultant` };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { contact } = dict;
  const settings = await getSiteSettings();
  const contactInfo = settings ?? dict.data.contactInfo;
  const socialLinks = settings?.socialLinks.length ? settings.socialLinks : dict.data.socialLinks;

  const mapsApiKey = process.env.GOOGLE_MAPS_EMBED_API_KEY;
  const hasCoords = settings?.mapLat != null && settings?.mapLng != null;
  const mapQuery = hasCoords
    ? `${settings!.mapLat},${settings!.mapLng}`
    : encodeURIComponent(contactInfo.address);
  const mapSrc = mapsApiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsApiKey}&q=${mapQuery}`
    : `https://maps.google.com/maps?q=${mapQuery}&z=15&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  return (
    <ContentSheet>
      <PageIntro
        breadcrumb={[{ label: dict.common.home, href: `/${locale}` }, { label: contact.title }]}
        title={contact.title}
      />

      <section className={styles.grid}>
        <div className={styles.info}>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              <ContactGlyph type="address" />
              {contact.addressLabel}
            </span>
            <span className={styles.fieldValueThai}>{contactInfo.address}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              <ContactGlyph type="phone" />
              {contact.phoneLabel}
            </span>
            <a className={styles.fieldValue} href={`tel:${contactInfo.phone.replace(/-/g, "")}`}>
              {contactInfo.phone}
            </a>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              <ContactGlyph type="email" />
              {contact.emailLabel}
            </span>
            <a className={styles.fieldValue} href={`mailto:${contactInfo.email}`}>
              {contactInfo.email}
            </a>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>
              <ContactGlyph type="social" />
              {contact.socialLabel}
            </span>
            <div className={styles.socialRow}>
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className={styles.socialIcon}
                  aria-label={social.name}
                >
                  <SocialIcon name={social.name} size={18} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.mapWrap}>
          <iframe
            className={styles.map}
            title={contact.mapLabel}
            src={mapSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a className={styles.mapLink} href={mapLink} target="_blank" rel="noopener noreferrer">
            {contact.mapLabel}
          </a>
        </div>
      </section>
    </ContentSheet>
  );
}
