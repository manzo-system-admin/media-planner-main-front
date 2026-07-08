import Link from "next/link";
import ContentSheet from "@/components/ContentSheet";
import styles from "./not-found.module.css";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale } from "@/lib/i18n/config";

export default function NotFound() {
  const locale = defaultLocale;
  const dict = getDictionary(locale);
  const { notFound } = dict;

  return (
    <ContentSheet>
      <div className={styles.wrap}>
        <p className={styles.code}>404</p>
        <h1 className={styles.title}>{notFound.title}</h1>
        <p className={styles.desc}>{notFound.description}</p>
        <div className={styles.actions}>
          <Link href={`/${locale}`} className={styles.primaryButton}>
            {notFound.homeButton}
          </Link>
          <Link href={`/${locale}/contact`} className={styles.secondaryButton}>
            {notFound.contactButton}
          </Link>
        </div>
      </div>
    </ContentSheet>
  );
}
