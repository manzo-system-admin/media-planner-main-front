"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import styles from "./AdminShell.module.css";

const NAV_GROUPS: {
  label: string;
  adminOnly?: boolean;
  links: { href: string; label: string; adminOnly?: boolean }[];
}[] = [
  {
    label: "หน้าแรก",
    links: [{ href: "/admin", label: "แดชบอร์ด" }],
  },
  {
    label: "หน้าเว็บไซต์",
    links: [
      { href: "/admin/banners", label: "แบนเนอร์" },
      { href: "/admin/video-popup", label: "วิดีโอป๊อปอัป" },
      { href: "/admin/about", label: "หน้าเกี่ยวกับเรา", adminOnly: true },
      { href: "/admin/contact", label: "ข้อมูลติดต่อ", adminOnly: true },
    ],
  },
  {
    label: "เนื้อหา",
    links: [
      { href: "/admin/services", label: "บริการ" },
      { href: "/admin/portfolio", label: "ผลงาน/เคส" },
      { href: "/admin/news", label: "ข่าวสาร/บทความ" },
      { href: "/admin/news-categories", label: "หมวดหมู่ข่าว" },
      { href: "/admin/video-library", label: "คลังวิดีโอ" },
      { href: "/admin/event-gallery", label: "คลังภาพกิจกรรม" },
    ],
  },
  {
    label: "องค์กร",
    links: [
      { href: "/admin/team", label: "แกลเลอรีภาพทีมงาน" },
      { href: "/admin/clients", label: "ลูกค้า/พันธมิตร" },
    ],
  },
  {
    label: "ระบบ",
    links: [
      { href: "/admin/logs", label: "บันทึกกิจกรรม" },
      { href: "/admin/users", label: "ผู้ใช้งาน", adminOnly: true },
    ],
  },
];

export default function AdminShell({
  email,
  role,
  children,
}: {
  email: string;
  role: "admin" | "staff";
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const visibleGroups = NAV_GROUPS.filter((group) => !group.adminOnly || role === "admin")
    .map((group) => ({
      ...group,
      links: group.links.filter((link) => !link.adminOnly || role === "admin"),
    }));

  const handleLogout = async () => {
    await fetch("/api/auth/session", { method: "DELETE" });
    await signOut(getFirebaseAuth()).catch(() => {});
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <span className={styles.logoBadge}>
            <Image
              src="/images/logo.jpg"
              alt="Media Planner Consultant"
              width={40}
              height={40}
              className={styles.logoImg}
            />
          </span>
          <span className={styles.brandText}>
            <span className={styles.brandName}>Media Planner</span>
            <span className={styles.brandSub}>Backoffice</span>
          </span>
        </div>
        <nav className={styles.nav}>
          {visibleGroups.map((group) => (
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
          {email && (
            <span className={styles.email}>
              {email} · {role === "admin" ? "Admin" : "Staff"}
            </span>
          )}
          <button type="button" className={styles.logout} onClick={handleLogout}>
            ออกจากระบบ
          </button>
        </header>
        <main className={styles.content}>{children}</main>
      </div>
    </div>
  );
}
