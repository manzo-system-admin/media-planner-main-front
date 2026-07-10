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
  const settings = await getSiteSettings(locale);
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
            <span className={styles.fieldLabel}>{contact.addressLabel}</span>
            <span className={styles.fieldValueThai}>{contactInfo.address}</span>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{contact.phoneLabel}</span>
            <a className={styles.fieldValue} href={`tel:${contactInfo.phone.replace(/-/g, "")}`}>
              {contactInfo.phone}
            </a>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{contact.emailLabel}</span>
            <a className={styles.fieldValue} href={`mailto:${contactInfo.email}`}>
              {contactInfo.email}
            </a>
          </div>
          <div className={styles.field}>
            <span className={styles.fieldLabel}>{contact.socialLabel}</span>
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
