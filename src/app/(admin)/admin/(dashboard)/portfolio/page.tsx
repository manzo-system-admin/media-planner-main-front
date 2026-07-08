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
import type { PortfolioDoc } from "@/lib/cms/portfolio";
import styles from "../news/page.module.css";

type Row = PortfolioDoc;

export default function PortfolioListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "portfolio"), orderBy("order", "asc")));
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await softDeleteDoc("portfolio", confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: "image",
      label: "",
      render: (item) =>
        // eslint-disable-next-line @next/next/no-img-element
        item.image ? <img src={item.image} alt="" className={styles.thumb} /> : null,
    },
    { key: "title", label: "ชื่อผลงาน", render: (item) => item.title?.th },
    { key: "category", label: "หมวดหมู่", render: (item) => item.category },
    { key: "slug", label: "Slug", render: (item) => item.slug },
  ];

  return (
    <div>
      <h1 className={styles.title}>ผลงาน/เคส</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.title?.th ?? ""} ${item.title?.en ?? ""} ${item.category}`}
        onNewClick={() => router.push("/admin/portfolio/new")}
        newLabel="+ เพิ่มผลงานใหม่"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/portfolio/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบผลงานนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
