"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import styles from "./AdminShell.module.css";

const NAV_GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "หน้าแรก",
    links: [{ href: "/admin", label: "แดชบอร์ด" }],
  },
  {
    label: "หน้าเว็บไซต์",
    links: [
      { href: "/admin/banners", label: "แบนเนอร์" },
      { href: "/admin/video-popup", label: "วิดีโอป๊อปอัป" },
    ],
  },
  {
    label: "เนื้อหา",
    links: [
      { href: "/admin/services", label: "บริการ" },
      { href: "/admin/portfolio", label: "ผลงาน/เคส" },
      { href: "/admin/portfolio-categories", label: "หมวดหมู่ผลงาน" },
      { href: "/admin/news", label: "ข่าวสาร/บทความ" },
      { href: "/admin/video-library", label: "คลังวิดีโอ" },
      { href: "/admin/event-gallery", label: "คลังภาพกิจกรรม" },
    ],
  },
  {
    label: "องค์กร",
    links: [
      { href: "/admin/team", label: "ทีมงาน" },
      { href: "/admin/awards", label: "รางวัล" },
      { href: "/admin/clients", label: "ลูกค้า/พันธมิตร" },
    ],
  },
  {
    label: "แชท",
    links: [
      { href: "/admin/faq", label: "FAQ" },
      { href: "/admin/chat", label: "Live Chat" },
    ],
  },
];

export default function AdminShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getFirebaseAuth()).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>Media Planner · Backoffice</div>
        <nav className={styles.nav}>
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <div className={styles.navGroupLabel}>{group.label}</div>
              {group.links.map((link) => {
                const active =
                  link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`${styles.navLink} ${active ? styles.navLinkActive : ""}`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>

      <div className={styles.main}>
        <header className={styles.topbar}>
          {email && <span className={styles.email}>{email}</span>}
          <button type="button" className={styles.logout} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
