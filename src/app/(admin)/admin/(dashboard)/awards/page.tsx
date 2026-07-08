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
import type { AwardDoc } from "@/lib/cms/org";
import styles from "../news/page.module.css";

type Row = AwardDoc;

export default function AwardsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "awards"), orderBy("order", "asc")));
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await softDeleteDoc("awards", confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    { key: "name", label: "ชื่อรางวัล", render: (item) => item.name?.th },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>รางวัล</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.name?.th ?? ""} ${item.name?.en ?? ""}`}
        onNewClick={() => router.push("/admin/awards/new")}
        newLabel="+ เพิ่มรางวัล"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/awards/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบรางวัลนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
