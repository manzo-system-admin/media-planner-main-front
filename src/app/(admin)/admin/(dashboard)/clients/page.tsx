"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { collection, doc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { excludeDeleted, reorderCollection, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import RowActionsMenu from "@/components/admin/RowActionsMenu";
import { CLIENT_CATEGORIES } from "@/lib/cms/clientCategories";
import type { ClientCategory } from "@/lib/cms/clientCategories";
import type { ClientDoc } from "@/lib/cms/orgTypes";
import styles from "./page.module.css";

type Row = ClientDoc;

const CATEGORY_LABELS = Object.fromEntries(
  CLIENT_CATEGORIES.map((category) => [category.key, category.label])
);

export default function ClientsListPage() {
  const router = useRouter();
  const [items, setItems] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleted, setDeleted] = useState(false);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [savingCategoryId, setSavingCategoryId] = useState<string | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dropIndex, setDropIndex] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "clients"), orderBy("order", "asc")));
      setItems(excludeDeleted(snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Row, "id">) }))));
      setLoading(false);
    })();
  }, []);

  const persistOrder = async (ordered: Row[]) => {
    setSaveStatus("saving");
    try {
      await reorderCollection(
        "clients",
        ordered.map((item) => item.id)
      );
      setSaveStatus("saved");
    } catch {
      setSaveStatus("error");
    }
  };

  const applyReorder = (from: number, to: number) => {
    if (to < 0 || to >= items.length || from === to) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    setItems(next);
    void persistOrder(next);
  };

  const moveBy = (index: number, delta: number) => applyReorder(index, index + delta);

  const updateCategory = async (id: string, category: ClientCategory) => {
    const previous = items;
    setSavingCategoryId(id);
    setSaveStatus("saving");
    setItems((list) => list.map((item) => (item.id === id ? { ...item, category } : item)));
    try {
      await updateDoc(doc(getFirebaseDb(), "clients", id), { category });
      setSaveStatus("saved");
    } catch {
      setItems(previous);
      setSaveStatus("error");
    } finally {
      setSavingCategoryId(null);
    }
  };

  const dragEnabled = search.trim().length === 0;

  const onDragStart = (index: number) => {
    if (!dragEnabled) return;
    setDragIndex(index);
  };

  const onDragOver = (e: React.DragEvent, index: number) => {
    if (!dragEnabled || dragIndex === null) return;
    e.preventDefault();
    setDropIndex(index);
  };

  const onDrop = (index: number) => {
    if (!dragEnabled || dragIndex === null) {
      setDragIndex(null);
      setDropIndex(null);
      return;
    }
    applyReorder(dragIndex, index);
    setDragIndex(null);
    setDropIndex(null);
  };

  const onDragEnd = () => {
    setDragIndex(null);
    setDropIndex(null);
  };

  const confirmDelete = async () => {
    if (!confirmId) return;
    setDeleting(true);
    const target = items.find((item) => item.id === confirmId);
    await softDeleteDoc("clients", confirmId, "ลูกค้า/พันธมิตร", target?.name ?? confirmId);
    setItems((list) => list.filter((item) => item.id !== confirmId));
    setDeleting(false);
    setConfirmId(null);
    setDeleted(true);
  };

  const filtered = search.trim()
    ? items.filter((item) =>
        `${item.name} ${item.category ? CATEGORY_LABELS[item.category] : ""}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      )
    : items;

  return (
    <div>
      <h1 className={styles.title}>ลูกค้า/พันธมิตร</h1>

      <div className={styles.wrap}>
        <div className={styles.toolbar}>
          <input
            type="text"
            className={styles.search}
            placeholder="ค้นหา..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button type="button" className={styles.newButton} onClick={() => router.push("/admin/clients/new")}>
            + เพิ่มลูกค้า
          </button>
        </div>

        {!dragEnabled && (
          <div className={styles.hint}>ล้างช่องค้นหาเพื่อลากจัดเรียงลำดับ</div>
        )}
        {dragEnabled && saveStatus === "saving" && <div className={styles.saveStatus}>กำลังบันทึกลำดับ...</div>}
        {dragEnabled && saveStatus === "saved" && <div className={styles.saveStatus}>บันทึกลำดับแล้ว</div>}
        {dragEnabled && saveStatus === "error" && (
          <div className={styles.saveStatus} style={{ color: "var(--grad-red)" }}>
            บันทึกลำดับไม่สำเร็จ กรุณาลองใหม่
          </div>
        )}

        {loading && <div className={styles.empty}>กำลังโหลด...</div>}
        {!loading && filtered.length === 0 && <div className={styles.empty}>ไม่พบข้อมูล</div>}

        {!loading && filtered.length > 0 && (
          <div className={styles.list}>
            {filtered.map((item, index) => (
              <ClientRow
                key={item.id}
                item={item}
                index={index}
                total={filtered.length}
                dragEnabled={dragEnabled}
                isDragging={dragIndex === index}
                isDropTarget={dropIndex === index && dragIndex !== index}
                onDragStart={() => onDragStart(index)}
                onDragOver={(e) => onDragOver(e, index)}
                onDrop={() => onDrop(index)}
                onDragEnd={onDragEnd}
                onMoveUp={() => moveBy(index, -1)}
                onMoveDown={() => moveBy(index, 1)}
                onCategoryChange={(category) => updateCategory(item.id, category)}
                categorySaving={savingCategoryId === item.id}
                onDelete={() => setConfirmId(item.id)}
              />
            ))}
          </div>
        )}
      </div>

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

function ClientRow({
  item,
  index,
  total,
  dragEnabled,
  isDragging,
  isDropTarget,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  onMoveUp,
  onMoveDown,
  onCategoryChange,
  categorySaving,
  onDelete,
}: {
  item: Row;
  index: number;
  total: number;
  dragEnabled: boolean;
  isDragging: boolean;
  isDropTarget: boolean;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  onDragEnd: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCategoryChange: (category: ClientCategory) => void;
  categorySaving: boolean;
  onDelete: () => void;
}) {
  return (
    <div
      className={`${styles.row} ${isDragging ? styles.rowDragging : ""} ${
        isDropTarget ? styles.rowDropTarget : ""
      }`}
      draggable={dragEnabled}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      <span
        className={`${styles.dragHandle} ${!dragEnabled ? styles.dragHandleDisabled : ""}`}
        aria-hidden="true"
      >
        ⠿
      </span>

      <div className={styles.moveButtons}>
        <button
          type="button"
          className={styles.moveButton}
          disabled={!dragEnabled || index === 0}
          onClick={onMoveUp}
          aria-label="เลื่อนขึ้น"
        >
          ▲
        </button>
        <button
          type="button"
          className={styles.moveButton}
          disabled={!dragEnabled || index === total - 1}
          onClick={onMoveDown}
          aria-label="เลื่อนลง"
        >
          ▼
        </button>
      </div>

      <span className={styles.orderBadge}>{index + 1}</span>

      {item.logoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.logoUrl} alt="" className={styles.thumb} />
      ) : (
        <span className={styles.thumb} />
      )}

      <span className={styles.name}>{item.name}</span>

      <label className={styles.categoryControl}>
        <span className={styles.categoryLabel}>หมวดหมู่</span>
        <select
          className={styles.categorySelect}
          value={item.category ?? "pr"}
          disabled={categorySaving}
          onMouseDown={(event) => event.stopPropagation()}
          onPointerDown={(event) => event.stopPropagation()}
          onChange={(event) => onCategoryChange(event.target.value as ClientCategory)}
        >
          {CLIENT_CATEGORIES.map((category) => (
            <option key={category.key} value={category.key}>
              {CATEGORY_LABELS[category.key]}
            </option>
          ))}
        </select>
      </label>

      <RowActionsMenu editHref={`/admin/clients/${item.id}`} onDelete={onDelete} />
    </div>
  );
}
