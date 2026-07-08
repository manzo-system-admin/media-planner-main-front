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
import type { ClientDoc } from "@/lib/cms/org";
import styles from "../news/page.module.css";

type Row = ClientDoc;

export default function ClientsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "clients"), orderBy("order", "asc")));
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    await softDeleteDoc("clients", confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const columns: DataTableColumn<Row>[] = [
    {
      key: "logoUrl",
      label: "",
      render: (item) =>
        // eslint-disable-next-line @next/next/no-img-element
        item.logoUrl ? <img src={item.logoUrl} alt="" className={styles.thumb} /> : null,
    },
    { key: "name", label: "ชื่อลูกค้า/พันธมิตร", render: (item) => item.name },
    { key: "order", label: "ลำดับ", render: (item) => item.order ?? "-" },
  ];

  return (
    <div>
      <h1 className={styles.title}>ลูกค้า/พันธมิตร</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => item.name}
        onNewClick={() => router.push("/admin/clients/new")}
        newLabel="+ เพิ่มลูกค้า"
        loading={loading}
        renderActions={(item) => (
          <RowActionsMenu editHref={`/admin/clients/${item.id}`} onDelete={() => setConfirmId(item.id)} />
        )}
      />

      <AdminConfirmModal
        open={!!confirmId}
        message="ลบลูกค้ารายนี้ใช่หรือไม่?"
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setConfirmId(null)}
      />

      <AdminAlertModal open={deleted} message="ลบสำเร็จ" tone="success" onClose={() => setDeleted(false)} />
    </div>
  );
}
