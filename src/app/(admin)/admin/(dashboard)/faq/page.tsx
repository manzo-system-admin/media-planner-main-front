"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { excludeDeleted, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import RowActionsMenu from "@/components/admin/RowActionsMenu";
import styles from "../news/page.module.css";

type Row = {
  id: string;
  question: { th: string; en: string };
  answer: { th: string; en: string };
  deleted?: boolean;
};

export default function FaqListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(collection(getFirebaseDb(), "faq"));
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await softDeleteDoc("faq", confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    { key: "question", label: "คำถาม", render: (item) => item.question?.th },
    { key: "answer", label: "คำตอบ", render: (item) => item.answer?.th },
  ];

  return (
    <div>
      <h1 className={styles.title}>FAQ — ฐานความรู้สำหรับ Live Chat</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        Live Chat จะใช้คำถาม-คำตอบเหล่านี้เป็นข้อมูลอ้างอิงในการตอบผู้เข้าชมเว็บโดยอัตโนมัติ
      </p>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.question?.th ?? ""} ${item.question?.en ?? ""}`}
        onNewClick={() => router.push("/admin/faq/new")}
        newLabel="+ เพิ่มคำถาม"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/faq/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบคำถามนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
