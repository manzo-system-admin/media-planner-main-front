"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import styles from "../../news/[id]/page.module.css";

type FormState = {
  question: { th: string; en: string };
  answer: { th: string; en: string };
};

const EMPTY: FormState = { question: { th: "", en: "" }, answer: { th: "", en: "" } };

export default function FaqFormPage() {
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
      const snapshot = await getDoc(doc(getFirebaseDb(), "faq", params.id));
      if (snapshot.exists()) setForm(snapshot.data() as FormState);
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "faq"), form);
      } else {
        await updateDoc(doc(getFirebaseDb(), "faq", params.id), { ...form });
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
    await softDeleteDoc("faq", params.id);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={styles.title}>{isNew ? "เพิ่มคำถามใหม่" : "แก้ไขคำถาม"}</h1>
      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำถาม (ไทย)</span>
            <input
              className={styles.input}
              value={form.question.th}
              onChange={(e) => setForm({ ...form, question: { ...form.question, th: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำถาม (English)</span>
            <input
              className={styles.input}
              value={form.question.en}
              onChange={(e) => setForm({ ...form, question: { ...form.question, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำตอบ (ไทย)</span>
            <textarea
              className={styles.textarea}
              value={form.answer.th}
              onChange={(e) => setForm({ ...form, answer: { ...form.answer, th: e.target.value } })}
            />
          </div>
          <div className={styles.field}>
            <span className={styles.langLabel}>คำตอบ (English)</span>
            <textarea
              className={styles.textarea}
              value={form.answer.en}
              onChange={(e) => setForm({ ...form, answer: { ...form.answer, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={styles.actions}>
          <button type="button" className={styles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={styles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบคำถามนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบคำถามนี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/faq");
        }}
      />
    </div>
  );
}
