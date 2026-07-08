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
import type { PortfolioCategoryDoc } from "@/lib/cms/portfolio";
import styles from "../news/page.module.css";

type Row = PortfolioCategoryDoc;

export default function PortfolioCategoriesListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(
        query(collection(getFirebaseDb(), "portfolioCategories"), orderBy("order", "asc"))
      );
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await softDeleteDoc("portfolioCategories", confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    { key: "key", label: "Key", render: (item) => item.key },
    { key: "label", label: "ชื่อที่แสดง", render: (item) => item.label?.th },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>หมวดหมู่ผลงาน</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        Key ต้องตรงกับค่าที่ใช้ในผลงาน: MEDIA_PLANNING, DIGITAL, CREATIVE, PR_EVENT
      </p>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.key} ${item.label?.th ?? ""}`}
        onNewClick={() => router.push("/admin/portfolio-categories/new")}
        newLabel="+ เพิ่มหมวดหมู่"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu
            editHref={`/admin/portfolio-categories/${item.id}`}
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
