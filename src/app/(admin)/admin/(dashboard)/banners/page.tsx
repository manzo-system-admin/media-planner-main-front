"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAdminLoad } from "@/lib/admin/useAdminLoad";
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
  const [deleted, setDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { loading, loadError, retry } = useAdminLoad(async () => {
  const snapshot = await getDocs(query(collection(getFirebaseDb(), "banners"), orderBy("order", "asc")));
  setItems(
    excludeDeleted(
      snapshot.docs.map((d) => {
        const data = d.data() as Omit<Row, "id">;
        return { id: d.id, ...data, alt: toText(data.alt) };
      })
    )
  );
  });

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const target = items.find((item) => item.id === confirmId);
      await softDeleteDoc("banners", confirmId, "แบนเนอร์", target?.alt || "แบนเนอร์");
      setItems((list) => list.filter((item) => item.id !== confirmId));
      setConfirmId(null);
      setDeleted(true);
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "ลบข้อมูลไม่สำเร็จ");
    } finally {
      setDeleting(false);
    }
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: "preview",
      label: "ตัวอย่างสื่อ",
      render: (item) => {
        const preview = item.type === "video" ? item.poster : item.src;
        return (
          <div className={styles.mediaPreview}>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className={styles.thumb} />
            ) : item.type === "video" && item.src ? (
              <video
                src={item.src}
                className={styles.thumb}
                muted
                playsInline
                preload="metadata"
                aria-label={`ตัวอย่างวิดีโอ ${item.alt || "แบนเนอร์"}`}
              />
            ) : (
              <span className={styles.mediaPlaceholder} aria-hidden="true">ภาพ</span>
            )}
            <span className={styles.mediaType}>{item.type === "video" ? "วิดีโอ" : "รูปภาพ"}</span>
          </div>
        );
      },
    },
    { key: "type", label: "ประเภท", render: (item) => (item.type === "video" ? "วิดีโอ" : "รูปภาพ") },
    { key: "alt", label: "คำอธิบาย", render: (item) => item.alt },
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
        loadError={loadError}
        onRetry={retry}
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
      <AdminAlertModal open={!!deleteError} message={deleteError ?? ""} tone="error" onClose={() => setDeleteError(null)} />
    </div>
  );
}
