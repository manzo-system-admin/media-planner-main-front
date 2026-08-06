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
import type { PortfolioDoc } from "@/lib/cms/portfolio";
import type { ClientDoc } from "@/lib/cms/org";
import styles from "../news/page.module.css";

type Row = PortfolioDoc;

export default function PortfolioListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [clientNamesById, setClientNamesById] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    (async () => {
      const [portfolioSnapshot, clientsSnapshot] = await Promise.all([
        getDocs(query(collection(getFirebaseDb(), "portfolio"), orderBy("order", "asc"))),
        getDocs(collection(getFirebaseDb(), "clients")),
      ]);
      setItems(
        excludeDeleted(
          portfolioSnapshot.docs.map((d) => {
            const data = d.data() as Omit<Row, "id">;
            return { id: d.id, ...data, title: toText(data.title) };
          })
        )
      );
      const namesById: Record<string, string> = {};
      clientsSnapshot.docs.forEach((d) => {
        namesById[d.id] = (d.data() as Omit<ClientDoc, "id">).name;
      });
      setClientNamesById(namesById);
      setLoading(false);
    })();
  }, []);

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const target = items.find((item) => item.id === confirmId);
    await softDeleteDoc("portfolio", confirmId, "ผลงาน/เคส", target?.title || confirmId);
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
        item.images?.[0] ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.images[0]} alt="" className={styles.thumb} />
        ) : null,
    },
    { key: "title", label: "ชื่อผลงาน", render: (item) => item.title },
    {
      key: "client",
      label: "ลูกค้า",
      render: (item) => (item.clientId ? clientNamesById[item.clientId] || "-" : "-"),
    },
  ];

  return (
    <div>
      <h1 className={styles.title}>ผลงาน/เคส</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) =>
          `${item.title ?? ""} ${item.clientId ? clientNamesById[item.clientId] ?? "" : ""}`
        }
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
