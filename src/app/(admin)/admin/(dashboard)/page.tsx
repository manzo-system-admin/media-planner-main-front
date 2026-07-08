import styles from "./page.module.css";

export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className={styles.title}>แดชบอร์ด</h1>
      <p className={styles.subtitle}>จัดการเนื้อหาเว็บไซต์ Media Planner Consultant</p>
      <div className={styles.grid}>
        <div className={styles.card}>
          <div className={styles.cardTitle}>ข่าวสาร/บทความ</div>
          <div className={styles.cardDesc}>สร้าง แก้ไข ลบข่าวสาร พร้อม editor และอัปโหลดสื่อ</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>FAQ</div>
          <div className={styles.cardDesc}>คลังคำถาม-คำตอบที่ใช้เป็นฐานความรู้ให้ Live Chat ตอบอัตโนมัติ</div>
        </div>
        <div className={styles.card}>
          <div className={styles.cardTitle}>Live Chat</div>
          <div className={styles.cardDesc}>ดูบทสนทนากับผู้เข้าชมเว็บ และตอบกลับด้วยตนเองได้ทุกเมื่อ</div>
        </div>
      </div>
    </div>
  );
}
