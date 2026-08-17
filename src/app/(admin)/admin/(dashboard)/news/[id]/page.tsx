"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { toText, type NewsCategoryDoc, type NewsDoc } from "@/lib/cms/types";
import styles from "./page.module.css";

type FormState = Omit<NewsDoc, "id" | "createdAt">;
type PinConflict = { id: string; title: string };

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY: FormState = {
  date: todayIso(),
  category: "",
  title: "",
  image: "",
  body: "",
  pinned: false,
};

export default function NewsFormPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState<FormState>(EMPTY);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone; redirect?: boolean } | null>(
    null
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [categories, setCategories] = useState<{ key: string; label: string }[]>([]);
  const [pinConflict, setPinConflict] = useState<PinConflict | null>(null);
  const [replacingPin, setReplacingPin] = useState(false);

  const findPinnedConflict = async (): Promise<PinConflict | null> => {
    const snapshot = await getDocs(
      query(collection(getFirebaseDb(), "news"), where("pinned", "==", true))
    );
    const conflict = snapshot.docs.find((item) => {
      const data = item.data() as Omit<NewsDoc, "id">;
      return item.id !== params.id && data.deleted !== true;
    });
    if (!conflict) return null;
    const data = conflict.data() as Omit<NewsDoc, "id">;
    return { id: conflict.id, title: toText(data.title) || conflict.id };
  };

  const requestPinReplace = async () => {
    const conflict = await findPinnedConflict();
    if (conflict) {
      setPinConflict(conflict);
      setForm((current) => ({ ...current, pinned: false }));
      return;
    }
    setForm((current) => ({ ...current, pinned: true }));
  };

  const confirmPinReplace = async () => {
    if (!pinConflict) return;
    setReplacingPin(true);
    try {
      await updateDoc(doc(getFirebaseDb(), "news", pinConflict.id), { pinned: false });
      setForm((current) => ({ ...current, pinned: true }));
      setPinConflict(null);
      setAlert({ message: "เปลี่ยนข่าวปักหมุดแล้ว", tone: "success" });
    } catch (err) {
      setAlert({
        message: err instanceof Error ? err.message : "เปลี่ยนข่าวปักหมุดไม่สำเร็จ",
        tone: "error",
      });
    } finally {
      setReplacingPin(false);
    }
  };

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(
        query(collection(getFirebaseDb(), "newsCategories"), orderBy("order", "asc"))
      );
      const list = snapshot.docs
        .filter((d) => !d.data().deleted)
        .map((d) => {
          const data = d.data() as Omit<NewsCategoryDoc, "id">;
          return { key: data.key, label: toText(data.label) || data.key };
        });
      setCategories(list);
      if (isNew && list.length > 0) {
        setForm((f) => (f.category ? f : { ...f, category: list[0].key }));
      }
    })();
  }, [isNew]);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "news", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data();
        setForm({
          date: data.date || todayIso(),
          category: data.category ?? "",
          title: toText(data.title),
          image: data.image ?? "",
          body: toText(data.body),
          pinned: data.pinned === true,
        });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (form.pinned) {
        const conflict = await findPinnedConflict();
        if (conflict) {
          setPinConflict(conflict);
          return;
        }
      }
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "news"), {
          ...form,
          createdAt: serverTimestamp(),
        });
        await logActivity("create", "ข่าวสาร", form.title);
      } else {
        await updateDoc(doc(getFirebaseDb(), "news", params.id), { ...form });
        await logActivity("update", "ข่าวสาร", form.title);
      }
      setAlert({ message: "บันทึกสำเร็จ", tone: "success", redirect: true });
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "บันทึกไม่สำเร็จ", tone: "error" });
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    setDeleting(true);
    await softDeleteDoc("news", params.id, "ข่าวสาร", form.title);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={styles.title}>{isNew ? "เพิ่มข่าวใหม่" : "แก้ไขข่าว"}</h1>

      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>วันที่</label>
          <input
            type="date"
            className={styles.input}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>หมวดหมู่</label>
          <select
            className={styles.input}
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            {categories.length === 0 && <option value={form.category}>{form.category}</option>}
            {categories.map((cat) => (
              <option key={cat.key} value={cat.key}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>รูปภาพหน้าปก</label>
          <MediaUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="news"
            accept="image/*"
            label="อัปโหลดรูปภาพหน้าปก"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>หัวข้อ</label>
          <input
            className={styles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <label className={styles.checkField}>
          <input
            type="checkbox"
            checked={form.pinned === true}
            onChange={async (e) => {
              const checked = e.target.checked;
              if (!checked) {
                setForm({ ...form, pinned: false });
                return;
              }
              await requestPinReplace();
            }}
          />
          <span>ปักหมุดข่าวนี้</span>
        </label>

        <div className={styles.field}>
          <label className={styles.label}>เนื้อหาบทความ</label>
          <RichTextEditor value={form.body} onChange={(html) => setForm({ ...form, body: html })} />
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={styles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบข่าวนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบข่าวนี้ใช่หรือไม่?"
        busy={deleting}
        busyLabel="กำลังลบ..."
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <AdminConfirmModal
        open={!!pinConflict}
        message={`มีข่าวที่ปักหมุดอยู่แล้ว: ${pinConflict?.title ?? ""} ต้องการปลดปักหมุดข่าวเก่าและใช้ข่าวนี้แทนใช่หรือไม่?`}
        tone="info"
        confirmLabel="ยืนยัน"
        busyLabel="กำลังเปลี่ยน..."
        busy={replacingPin}
        onConfirm={confirmPinReplace}
        onCancel={() => setPinConflict(null)}
      />

      <AdminAlertModal
        open={!!alert}
        message={alert?.message ?? ""}
        tone={alert?.tone}
        autoCloseMs={alert?.tone === "error" ? 3600 : 1400}
        onClose={() => {
          const shouldRedirect = alert?.redirect;
          setAlert(null);
          if (shouldRedirect) router.push("/admin/news");
        }}
      />
    </div>
  );
}
