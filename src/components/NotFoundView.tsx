import Link from "next/link";
import styles from "./NotFoundView.module.css";
import type { Dictionary } from "@/lib/dictionaries/types";
import type { Locale } from "@/lib/i18n/config";

export default function NotFoundView({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { notFound } = dict;

  return (
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
  );
}
