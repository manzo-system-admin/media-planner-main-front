import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getAdminDb } from "@/lib/firebase/admin";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import styles from "./page.module.css";

async function countActive(collection: string): Promise<number> {
  const snapshot = await getAdminDb().collection(collection).get();
  return snapshot.docs.filter((doc) => !doc.data().deleted).length;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "สวัสดีตอนเช้า";
  if (hour < 18) return "สวัสดีตอนบ่าย";
  return "สวัสดีตอนเย็น";
}

// 24x24 viewBox line icons, matching the ServiceIcon convention (white stroke on a colored chip).
const ICONS: Record<string, ReactNode> = {
  news: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <path d="M8 9h8M8 12.5h8M8 16h5" />
    </>
  ),
  portfolio: (
    <>
      <rect x="3.5" y="8" width="17" height="11" rx="2" />
      <path d="M8.5 8V6.5A2 2 0 0 1 10.5 4.5h3A2 2 0 0 1 15.5 6.5V8" />
    </>
  ),
  services: (
    <>
      <path d="M12 3.5 4.5 7.5v9L12 20.5l7.5-4v-9Z" />
      <path d="M12 3.5V20.5" />
    </>
  ),
  clients: (
    <>
      <circle cx="9" cy="9" r="3" />
      <path d="M3.5 19c0-3 2.5-5.2 5.5-5.2s5.5 2.2 5.5 5.2" />
      <circle cx="17" cy="8.5" r="2.4" />
      <path d="M15.5 13.5c2.3.4 4 2.3 4 4.8" />
    </>
  ),
  banners: (
    <>
      <rect x="3.5" y="5" width="17" height="12" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="M5 15.5 9 12l3 2.6 3.5-3.6L20.5 15" />
    </>
  ),
  gallery: (
    <>
      <path d="M4 8a2 2 0 0 1 2-2h1.2l.8-1.4h4l.8 1.4H14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2Z" />
      <circle cx="9" cy="12" r="2.6" />
      <circle cx="16.5" cy="8.5" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
};

function DashIcon({ name, color }: { name: string; color: string }) {
  return (
    <span className={styles.iconChip} style={{ background: color }}>
      <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
        {ICONS[name]}
      </svg>
    </span>
  );
}

const QUICK_LINKS = [
  { href: "/admin/news/new", label: "เพิ่มข่าวสาร", icon: "news", color: "var(--grad-purple)" },
  { href: "/admin/portfolio/new", label: "เพิ่มผลงาน", icon: "portfolio", color: "var(--grad-blue)" },
  { href: "/admin/services/new", label: "เพิ่มบริการ", icon: "services", color: "var(--grad-cyan)" },
  { href: "/admin/clients/new", label: "เพิ่มลูกค้า", icon: "clients", color: "var(--grad-green)" },
  { href: "/admin/banners/new", label: "เพิ่มแบนเนอร์", icon: "banners", color: "var(--grad-orange)" },
  { href: "/admin/event-gallery/new", label: "เพิ่มรูปกิจกรรม", icon: "gallery", color: "var(--grad-red)" },
];

export default async function AdminDashboardPage() {
  const user = await getSessionUser();
  const [newsCount, portfolioCount, servicesCount, clientsCount] = await Promise.all([
    countActive("news"),
    countActive("portfolio"),
    countActive("services"),
    countActive("clients"),
  ]);

  const dateLabel = new Date().toLocaleDateString("th-TH", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const stats = [
    { label: "ข่าวสาร/บทความ", value: newsCount, icon: "news", color: "var(--grad-purple)" },
    { label: "ผลงาน/เคส", value: portfolioCount, icon: "portfolio", color: "var(--grad-blue)" },
    { label: "บริการ", value: servicesCount, icon: "services", color: "var(--grad-cyan)" },
    { label: "ลูกค้า/พันธมิตร", value: clientsCount, icon: "clients", color: "var(--grad-green)" },
  ];

  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroBlobA} />
        <div className={styles.heroBlobB} />
        <Image
          src="/images/logo.jpg"
          alt=""
          width={220}
          height={220}
          className={styles.heroWatermark}
        />
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>
            <span className={styles.eyebrowDot} />
            {getGreeting()}
          </span>
          <h1 className={styles.title}>
            {user?.email ? `ยินดีต้อนรับ, ${user.email}` : "ยินดีต้อนรับสู่ Backoffice"}
          </h1>
          <p className={styles.subtitle}>
            {dateLabel} · จัดการเนื้อหาเว็บไซต์ Media Planner Consultant
          </p>
        </div>
      </section>

      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <DashIcon name={stat.icon} color={stat.color} />
            <div className={styles.statText}>
              <span className={styles.statValue}>{stat.value}</span>
              <span className={styles.statLabel}>{stat.label}</span>
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.sectionTitle}>ทางลัด</h2>
      <div className={styles.quickGrid}>
        {QUICK_LINKS.map((link) => (
          <Link key={link.href} href={link.href} className={styles.quickLink}>
            <DashIcon name={link.icon} color={link.color} />
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
