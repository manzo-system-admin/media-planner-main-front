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

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

const EMPTY: FormState = {
  date: todayIso(),
  category: "",
  title: "",
  image: "",
  excerpt: "",
  body: "",
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
          excerpt: toText(data.excerpt),
          body: toText(data.body),
        });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
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

        <div className={styles.field}>
          <label className={styles.label}>คำโปรย</label>
          <textarea
            className={styles.textarea}
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          />
        </div>

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
        onConfirm={confirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />

      <AdminAlertModal
        open={!!alert}
        message={alert?.message ?? ""}
        tone={alert?.tone}
        onClose={() => {
          const shouldRedirect = alert?.redirect;
          setAlert(null);
          if (shouldRedirect) router.push("/admin/news");
        }}
      />
    </div>
  );
}
