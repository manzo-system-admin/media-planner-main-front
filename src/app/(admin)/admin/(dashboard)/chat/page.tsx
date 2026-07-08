"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query, type Timestamp } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import styles from "../news/page.module.css";

type Row = {
  id: string;
  visitorUid: string;
  visitorName?: string;
  visitorEmail?: string;
  locale: string;
  botEnabled?: boolean;
  lastMessageAt?: Timestamp;
};

export default function ChatListPage() {
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(
        query(collection(getFirebaseDb(), "chatConversations"), orderBy("lastMessageAt", "desc"))
      );
      setItems(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) })));
      setLoading(false);
    })();
  }, []);

  const columns: DataTableColumn<Row>[] = [
    { key: "visitorName", label: "ชื่อ", render: (item) => item.visitorName || "-" },
    { key: "visitorEmail", label: "อีเมล", render: (item) => item.visitorEmail || "-" },
    { key: "locale", label: "ภาษา", render: (item) => item.locale?.toUpperCase() },
    {
      key: "bot",
      label: "บอทตอบอัตโนมัติ",
      render: (item) => (item.botEnabled === false ? "ปิด" : "เปิด"),
    },
    {
      key: "lastMessageAt",
      label: "ข้อความล่าสุด",
      render: (item) =>
        item.lastMessageAt
          ? item.lastMessageAt.toDate().toLocaleString("th-TH")
          : "-",
    },
  ];

  return (
    <div>
      <h1 className={styles.title}>Live Chat</h1>
      <DataTable
        columns={columns}
        items={items}
        getRowId={(item) => item.id}
        searchableText={(item) => `${item.visitorName ?? ""} ${item.visitorEmail ?? ""} ${item.id}`}
        loading={loading}
        renderActions={(item) => (
          <a className={styles.editLink} href={`/admin/chat/${item.id}`}>
            เปิดบทสนทนา
          </a>
        )}
      />
    </div>
  );
}
