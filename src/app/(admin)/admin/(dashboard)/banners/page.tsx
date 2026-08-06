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
import { toText } from "@/lib/cms/types";
import type { BannerDoc } from "@/lib/cms/homepage";
import styles from "../news/page.module.css";

type Row = BannerDoc;

export default function BannersListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "banners"), orderBy("order", "asc")));
      setItems(
        excludeDeleted(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Row, "id">;
            return { id: d.id, ...data, alt: toText(data.alt) };
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
    await softDeleteDoc("banners", confirmId, "แบนเนอร์", target?.alt || "แบนเนอร์");
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: "preview",
      label: "",
      render: (item) =>
        (item.type === "video" ? item.poster : item.src) ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.type === "video" ? item.poster : item.src} alt="" className={styles.thumb} />
        ) : null,
    },
    { key: "type", label: "ประเภท", render: (item) => (item.type === "video" ? "วิดีโอ" : "รูปภาพ") },
    { key: "alt", label: "คำอธิบาย", render: (item) => item.alt },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>แบนเนอร์ (Hero Carousel)</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.alt ?? ""} ${item.type}`}
        onNewClick={() => router.push("/admin/banners/new")}
        newLabel="+ เพิ่มสไลด์"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/banners/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบแบนเนอร์นี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
