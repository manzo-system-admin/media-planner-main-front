"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { collection, getDocs } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { useAdminLoad } from "@/lib/admin/useAdminLoad";
import { excludeDeleted, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import RowActionsMenu from "@/components/admin/RowActionsMenu";
import { toText } from "@/lib/cms/types";
import type { EventGalleryDoc } from "@/lib/cms/media";
import { sortMediaByDate } from "@/lib/cms/mediaSort";
import styles from "../news/page.module.css";

type Row = EventGalleryDoc;

export default function EventGalleryListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { loading, loadError, retry } = useAdminLoad(async () => {
  const snapshot = await getDocs(collection(getFirebaseDb(), "eventGallery"));
  const rows = snapshot.docs.map((d) => {
    const data = d.data() as Omit<Row, "id">;
    return { id: d.id, ...data, caption: toText(data.caption) };
  });
  setItems(sortMediaByDate(excludeDeleted(rows)));
  });

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const target = items.find((item) => item.id === confirmId);
      await softDeleteDoc(
        "eventGallery",
        confirmId,
        "คลังภาพกิจกรรม",
        target?.caption || "รูปกิจกรรม"
      );
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
      key: "image",
      label: "",
      render: (item) =>
        // eslint-disable-next-line @next/next/no-img-element
        item.image ? <img src={item.image} alt="" className={styles.thumb} /> : null,
    },
    { key: "caption", label: "ชื่อภาพกิจกรรม", render: (item) => item.caption || "-" },
    { key: "date", label: "วันที่", render: (item) => item.date || "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>คลังภาพกิจกรรม</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => item.caption ?? ""}
        onNewClick={() => router.push("/admin/event-gallery/new")}
        newLabel="+ เพิ่มภาพ"
        loading={loading}
        loadError={loadError}
        onRetry={retry}
        renderActions={(item) => (
          <RowActionsMenu
            editHref={`/admin/event-gallery/${item.id}`}
            onDelete={() => setConfirmId(item.id)}
          />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบภาพนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
      <AdminAlertModal open={!!deleteError} message={deleteError ?? ""} tone="error" onClose={() => setDeleteError(null)} />
    </div>
  );
}
