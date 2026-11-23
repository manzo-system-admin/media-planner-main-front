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
import type { VideoLibraryDoc } from "@/lib/cms/media";
import { sortMediaByDate } from "@/lib/cms/mediaSort";
import styles from "../news/page.module.css";

type Row = VideoLibraryDoc;

export default function VideoLibraryListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [deleted, setDeleted] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { loading, loadError, retry } = useAdminLoad(async () => {
  const snapshot = await getDocs(collection(getFirebaseDb(), "videoLibrary"));
  const rows = snapshot.docs.map((d) => {
    const data = d.data() as Omit<Row, "id">;
    return { id: d.id, ...data, title: toText(data.title) };
  });
  setItems(sortMediaByDate(excludeDeleted(rows)));
  });

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      const target = items.find((item) => item.id === confirmId);
      await softDeleteDoc("videoLibrary", confirmId, "คลังวิดีโอ", target?.title || confirmId);
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
      key: "thumbnail",
      label: "",
      render: (item) =>
        // eslint-disable-next-line @next/next/no-img-element
        item.thumbnail ? <img src={item.thumbnail} alt="" className={styles.thumb} /> : null,
    },
    { key: "title", label: "ชื่อวิดีโอ", render: (item) => item.title },
    { key: "date", label: "วันที่", render: (item) => item.date || "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>คลังวิดีโอ</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => item.title ?? ""}
        onNewClick={() => router.push("/admin/video-library/new")}
        newLabel="+ เพิ่มวิดีโอ"
        loading={loading}
        loadError={loadError}
        onRetry={retry}
        renderActions={(item) => (
          <RowActionsMenu
            editHref={`/admin/video-library/${item.id}`}
            onDelete={() => setConfirmId(item.id)}
          />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบวิดีโอนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
      <AdminAlertModal open={!!deleteError} message={deleteError ?? ""} tone="error" onClose={() => setDeleteError(null)} />
    </div>
  );
}
