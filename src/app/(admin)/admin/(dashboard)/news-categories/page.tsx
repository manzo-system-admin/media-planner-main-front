"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { excludeDeleted, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import RowActionsMenu from "@/components/admin/RowActionsMenu";
import { toText, type NewsCategoryDoc } from "@/lib/cms/types";
import styles from "../news/page.module.css";

type Row = NewsCategoryDoc;

export default function NewsCategoriesListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(
        query(collection(getFirebaseDb(), "newsCategories"), orderBy("order", "asc"))
      );
      setItems(
        excludeDeleted(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Row, "id">;
            return { id: d.id, ...data, label: toText(data.label) };
          })
        )
      );
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const target = items.find((item) => item.id === confirmId);
    await softDeleteDoc(
      "newsCategories",
      confirmId,
      "หมวดหมู่ข่าว",
      target?.label || confirmId
    );
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    { key: "key", label: "Key", render: (item) => item.key },
    { key: "label", label: "ชื่อที่แสดง", render: (item) => item.label },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>หมวดหมู่ข่าว</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        เพิ่ม/ลบ/แก้ไขหมวดหมู่ได้อิสระ เช่น ข่าวไอพีโอ, ข่าวประชาสัมพันธ์ — ข่าวแต่ละชิ้นจะเลือกหมวดหมู่จากรายการนี้
      </p>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.key} ${item.label ?? ""}`}
        onNewClick={() => router.push("/admin/news-categories/new")}
        newLabel="+ เพิ่มหมวดหมู่"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu
            editHref={`/admin/news-categories/${item.id}`}
            onDelete={() => setConfirmId(item.id)}
          />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบหมวดหมู่นี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
