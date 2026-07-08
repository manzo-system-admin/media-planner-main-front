"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import type { NewsDoc } from "@/lib/cms/types";
import styles from "./page.module.css";

type FormState = Omit<NewsDoc, "id" | "createdAt">;

const EMPTY: FormState = {
  slug: "",
  date: "",
  title: { th: "", en: "" },
  image: "",
  excerpt: { th: "", en: "" },
  body: { th: "", en: "" },
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

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "news", params.id));
      if (snapshot.exists()) {
        const data = snapshot.data() as FormState;
        setForm({
          slug: data.slug ?? "",
          date: data.date ?? "",
          title: data.title ?? { th: "", en: "" },
          image: data.image ?? "",
          excerpt: data.excerpt ?? { th: "", en: "" },
          body: data.body ?? { th: "", en: "" },
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
      } else {
        await updateDoc(doc(getFirebaseDb(), "news", params.id), { ...form });
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
    await softDeleteDoc("news", params.id);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={styles.title}>{isNew ? "เพิ่มข่าวใหม่" : "แก้ไขข่าว"}</h1>

      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Slug (ใช้ใน URL, ต้องไม่ซ้ำ)</label>
            <input
              className={styles.input}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>วันที่</label>
            <input
              className={styles.input}
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              placeholder="12 มิ.ย. 2569"
            />
          </div>
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

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.langLabel}>หัวข้อ (ไทย)</span>
            <input
              className={styles.input}
              value={form.title.th}
              onChange={(e) => setForm({ ...form, title: { ...form.title, th: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.langLabel}>หัวข้อ (English)</span>
            <input
              className={styles.input}
              value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำโปรย (ไทย)</span>
            <textarea
              className={styles.textarea}
              value={form.excerpt.th}
              onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, th: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำโปรย (English)</span>
            <textarea
              className={styles.textarea}
              value={form.excerpt.en}
              onChange={(e) => setForm({ ...form, excerpt: { ...form.excerpt, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.langLabel}>เนื้อหาบทความ (ไทย)</span>
          <RichTextEditor
            value={form.body.th}
            onChange={(html) => setForm({ ...form, body: { ...form.body, th: html } })}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.langLabel}>เนื้อหาบทความ (English)</span>
          <RichTextEditor
            value={form.body.en}
            onChange={(html) => setForm({ ...form, body: { ...form.body, en: html } })}
          />
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
