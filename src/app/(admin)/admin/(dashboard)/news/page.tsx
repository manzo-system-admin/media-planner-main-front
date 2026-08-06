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
import { toText, type NewsDoc } from "@/lib/cms/types";
import styles from "./page.module.css";

type Row = NewsDoc & { id: string };

export default function NewsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "news"), orderBy("createdAt", "desc")));
      setItems(
        excludeDeleted(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Row, "id">;
            return { id: d.id, ...data, title: toText(data.title) };
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
    await softDeleteDoc("news", confirmId, "ข่าวสาร", target?.title || confirmId);
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
    { key: "title", label: "หัวข้อ", render: (item) => item.title },
    { key: "category", label: "หมวดหมู่", render: (item) => item.category || "-" },
    { key: "date", label: "วันที่", render: (item) => item.date },
  ];

  return (
    <div>
      <h1 className={styles.title}>ข่าวสาร/บทความ</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => item.title ?? ""}
        onNewClick={() => router.push("/admin/news/new")}
        newLabel="+ เพิ่มข่าวใหม่"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/news/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบข่าวนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
