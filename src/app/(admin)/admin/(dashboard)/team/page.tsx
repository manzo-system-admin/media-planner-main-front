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
import type { TeamGalleryDoc } from "@/lib/cms/org";
import styles from "../news/page.module.css";

type Row = TeamGalleryDoc;

export default function TeamGalleryListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "team"), orderBy("order", "asc")));
      setItems(
        excludeDeleted(
          snapshot.docs.map((d) => {
            const data = d.data() as Omit<Row, "id">;
            return { id: d.id, ...data, caption: toText(data.caption) };
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
      "team",
      confirmId,
      "แกลเลอรีภาพทีมงาน",
      target?.caption || "รูปทีมงาน"
    );
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
    { key: "caption", label: "คำอธิบาย", render: (item) => item.caption || "-" },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>แกลเลอรีภาพทีมงาน/บรรยากาศการทำงาน</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => item.caption ?? ""}
        onNewClick={() => router.push("/admin/team/new")}
        newLabel="+ เพิ่มภาพ"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/team/${item.id}`} onDelete={() => setConfirmId(item.id)} />
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
    </div>
  );
}
