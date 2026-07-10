"use client";

import { useEffect, useState } from "react";
import styles from "./CookieConsent.module.css";
import type { Locale } from "@/lib/i18n/config";

type ConsentState = "accepted" | "declined";

const CONSENT_KEY = "mp_cookie_consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const copy = {
  th: {
    eyebrow: "COOKIE CONSENT",
    title: "เว็บไซต์นี้ใช้คุกกี้",
    description:
      "เราใช้คุกกี้เพื่อจดจำการตั้งค่า วิเคราะห์การใช้งาน และปรับปรุงประสบการณ์บนเว็บไซต์ของคุณ คุณสามารถยินยอมหรือปฏิเสธคุกกี้ที่ไม่จำเป็นได้",
    accept: "ยินยอม",
    decline: "ปฏิเสธ",
  },
  en: {
    eyebrow: "COOKIE CONSENT",
    title: "This website uses cookies",
    description:
      "We use cookies to remember preferences, understand site usage, and improve your experience. You can accept or decline non-essential cookies.",
    accept: "Accept",
    decline: "Decline",
  },
} as const;

function readStoredConsent(): ConsentState | null {
  const localValue = window.localStorage.getItem(CONSENT_KEY);
  if (localValue === "accepted" || localValue === "declined") return localValue;

  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${CONSENT_KEY}=`))
    ?.split("=")[1];

  return cookieValue === "accepted" || cookieValue === "declined" ? cookieValue : null;
}

function saveConsent(value: ConsentState) {
  window.localStorage.setItem(CONSENT_KEY, value);
  document.cookie = `${CONSENT_KEY}=${value}; Max-Age=${ONE_YEAR_SECONDS}; Path=/; SameSite=Lax`;
}

export default function CookieConsent({ locale }: { locale: Locale }) {
  const [visible, setVisible] = useState(false);
  const text = copy[locale];

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setVisible(readStoredConsent() === null);
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  const choose = (value: ConsentState) => {
    saveConsent(value);
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <section className={styles.banner} aria-labelledby="cookie-consent-title">
      <div className={styles.mark} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div className={styles.content}>
        <p className={styles.eyebrow}>{text.eyebrow}</p>
        <h2 id="cookie-consent-title" className={styles.title}>
          {text.title}
        </h2>
        <p className={styles.description}>{text.description}</p>
      </div>
      <div className={styles.actions}>
        <button type="button" className={styles.secondaryButton} onClick={() => choose("declined")}>
          {text.decline}
        </button>
        <button type="button" className={styles.primaryButton} onClick={() => choose("accepted")}>
          {text.accept}
        </button>
      </div>
    </section>
  );
}
