"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import type { ActivityAction } from "@/lib/admin/adminData";
import styles from "../news/page.module.css";
import logStyles from "./page.module.css";

type LogRow = {
  id: string;
  action: ActivityAction;
  section: string;
  label: string;
  actorEmail: string;
  createdAt: Date | null;
};

type LogDocData = {
  action: ActivityAction;
  section: string;
  label: string;
  actorEmail?: string;
  createdAt?: Timestamp;
};

const ACTION_LABELS: Record<ActivityAction, string> = {
  create: "เพิ่ม",
  update: "แก้ไข",
  delete: "ลบ",
};

const ACTION_BADGE_CLASS: Record<ActivityAction, string> = {
  create: "badgeCreate",
  update: "badgeUpdate",
  delete: "badgeDelete",
};

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const sevenDaysAgo = Timestamp.fromMillis(
        Date.now() - 7 * 24 * 60 * 60 * 1000,
      );
      const snapshot = await getDocs(
        query(
          collection(getFirebaseDb(), "activityLogs"),
          where("createdAt", ">=", sevenDaysAgo),
          orderBy("createdAt", "desc"),
        ),
      );
      setLogs(
        snapshot.docs.map((docSnap) => {
          const data = docSnap.data() as LogDocData;
          return {
            id: docSnap.id,
            action: data.action,
            section: data.section,
            label: data.label,
            actorEmail: data.actorEmail ?? "",
            createdAt: data.createdAt ? data.createdAt.toDate() : null,
          };
        }),
      );
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h1 className={styles.title}>บันทึกกิจกรรม</h1>
      <p
        style={{
          marginBottom: 16,
          color: "var(--text-muted)",
          font: "400 13px var(--font-admin)",
        }}
      >
        รายการเพิ่ม/แก้ไข/ลบข้อมูลในหลังบ้าน ย้อนหลัง 7 วัน
      </p>

      <div className={logStyles.wrap}>
        {loading && <div className={logStyles.empty}>กำลังโหลด...</div>}
        {!loading && logs.length === 0 && (
          <div className={logStyles.empty}>
            ไม่มีกิจกรรมในช่วง 7 วันที่ผ่านมา
          </div>
        )}
        {!loading && logs.length > 0 && (
          <table className={logStyles.table}>
            <thead>
              <tr>
                <th>เวลา</th>
                <th>การทำงาน</th>
                <th>หมวดหมู่</th>
                <th>รายการ</th>
                <th>ผู้ดำเนินการ</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id}>
                  <td>
                    {log.createdAt
                      ? log.createdAt.toLocaleString("th-TH", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </td>
                  <td>
                    <span
                      className={`${logStyles.badge} ${logStyles[ACTION_BADGE_CLASS[log.action]]}`}
                    >
                      {ACTION_LABELS[log.action] ?? log.action}
                    </span>
                  </td>
                  <td>{log.section}</td>
                  <td>
                    {log.label.slice(0, 70)}
                    {log.label.length > 70 ? "..." : ""}
                  </td>
                  <td>{log.actorEmail || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
