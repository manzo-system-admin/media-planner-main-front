"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MediaUploader from "@/components/admin/MediaUploader";
import type { PortfolioCategoryDoc, PortfolioDoc, PortfolioStatDoc } from "@/lib/cms/portfolio";

import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<PortfolioDoc, "id">;

const EMPTY: FormState = {
  slug: "",
  category: "",
  image: "",
  order: 0,
  client: { th: "", en: "" },
  title: { th: "", en: "" },
  challenge: { th: "", en: "" },
  approach: { th: "", en: "" },
  result: { th: "", en: "" },
  stats: [],
};

function StatsEditor({
  stats,
  onChange,
}: {
  stats: PortfolioStatDoc[];
  onChange: (stats: PortfolioStatDoc[]) => void;
}) {
  const update = (index: number, patch: Partial<PortfolioStatDoc>) => {
    const next = [...stats];
    next[index] = { ...next[index], ...patch };
    onChange(next);
  };

  return (
    <div className={formStyles.field}>
      <span className={formStyles.langLabel}>สถิติ/ตัวเลขผลงาน</span>
      {stats.map((stat, index) => (
        <div
          key={index}
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, alignItems: "center" }}
        >
          <input
            className={formStyles.input}
            placeholder="ป้ายกำกับ (ไทย)"
            value={stat.label.th}
            onChange={(e) => update(index, { label: { ...stat.label, th: e.target.value } })}
          />
          <input
            className={formStyles.input}
            placeholder="ป้ายกำกับ (English)"
            value={stat.label.en}
            onChange={(e) => update(index, { label: { ...stat.label, en: e.target.value } })}
          />
          <input
            className={formStyles.input}
            placeholder="ค่า (เช่น +32%)"
            value={stat.value.th}
            onChange={(e) =>
              update(index, { value: { th: e.target.value, en: e.target.value } })
            }
          />
          <button
            type="button"
            onClick={() => onChange(stats.filter((_, i) => i !== index))}
            style={{ color: "var(--grad-red)", background: "none", border: "none", cursor: "pointer" }}
          >
            ลบ
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          onChange([...stats, { label: { th: "", en: "" }, value: { th: "", en: "" } }])
        }
        style={{
          alignSelf: "flex-start",
          font: "600 12.5px var(--font-admin)",
          color: "var(--grad-blue)",
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
        + เพิ่มสถิติ
      </button>
    </div>
  );
}

export default function PortfolioFormPage() {
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
        query(collection(getFirebaseDb(), "portfolioCategories"), orderBy("order", "asc"))
      );
      const list = snapshot.docs
        .filter((d) => !d.data().deleted)
        .map((d) => {
          const data = d.data() as Omit<PortfolioCategoryDoc, "id">;
          return { key: data.key, label: data.label?.th || data.key };
        });
      setCategories(list);
      if (isNew && list.length > 0) {
        setForm((f) => (f.category ? f : { ...f, category: list[0].key }));
      }
    })();
  }, [isNew]);

  useEffect(() => {
    if (isNew) {
      (async () => {
        const nextOrder = await getNextOrder("portfolio");
        setForm((f) => ({ ...f, order: nextOrder }));
      })();
      return;
    }
    (async () => {
      const snapshot = await getDoc(doc(getFirebaseDb(), "portfolio", params.id));
      if (snapshot.exists()) setForm({ ...EMPTY, ...(snapshot.data() as FormState) });
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "portfolio"), form);
      } else {
        await updateDoc(doc(getFirebaseDb(), "portfolio", params.id), { ...form });
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
    await softDeleteDoc("portfolio", params.id);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มผลงานใหม่" : "แก้ไขผลงาน"}</h1>

      <div className={formStyles.form}>
        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <label className={formStyles.label}>Slug</label>
            <input
              className={formStyles.input}
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
            />
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>ลำดับ</label>
            <input
              type="number"
              className={formStyles.input}
              value={form.order ?? 0}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
            />
          </div>
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>หมวดหมู่</label>
          <select
            className={formStyles.input}
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

        <div className={formStyles.field}>
          <label className={formStyles.label}>รูปภาพ</label>
          <MediaUploader
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="portfolio"
            accept="image/*"
            label="อัปโหลดรูปภาพ"
          />
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ชื่อผลงาน (ไทย)</span>
            <input
              className={formStyles.input}
              value={form.title.th}
              onChange={(e) => setForm({ ...form, title: { ...form.title, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ชื่อผลงาน (English)</span>
            <input
              className={formStyles.input}
              value={form.title.en}
              onChange={(e) => setForm({ ...form, title: { ...form.title, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ลูกค้า (ไทย)</span>
            <input
              className={formStyles.input}
              value={form.client.th}
              onChange={(e) => setForm({ ...form, client: { ...form.client, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ลูกค้า (English)</span>
            <input
              className={formStyles.input}
              value={form.client.en}
              onChange={(e) => setForm({ ...form, client: { ...form.client, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>โจทย์ (ไทย)</span>
            <textarea
              className={formStyles.textarea}
              value={form.challenge.th}
              onChange={(e) => setForm({ ...form, challenge: { ...form.challenge, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>โจทย์ (English)</span>
            <textarea
              className={formStyles.textarea}
              value={form.challenge.en}
              onChange={(e) => setForm({ ...form, challenge: { ...form.challenge, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>แนวทางการทำงาน (ไทย)</span>
            <textarea
              className={formStyles.textarea}
              value={form.approach.th}
              onChange={(e) => setForm({ ...form, approach: { ...form.approach, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>แนวทางการทำงาน (English)</span>
            <textarea
              className={formStyles.textarea}
              value={form.approach.en}
              onChange={(e) => setForm({ ...form, approach: { ...form.approach, en: e.target.value } })}
            />
          </div>
        </div>

        <div className={formStyles.row}>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ผลลัพธ์ (ไทย)</span>
            <textarea
              className={formStyles.textarea}
              value={form.result.th}
              onChange={(e) => setForm({ ...form, result: { ...form.result, th: e.target.value } })}
            />
          </div>
          <div className={formStyles.field}>
            <span className={formStyles.langLabel}>ผลลัพธ์ (English)</span>
            <textarea
              className={formStyles.textarea}
              value={form.result.en}
              onChange={(e) => setForm({ ...form, result: { ...form.result, en: e.target.value } })}
            />
          </div>
        </div>

        <StatsEditor stats={form.stats} onChange={(stats) => setForm({ ...form, stats })} />

        <div className={formStyles.actions}>
          <button type="button" className={formStyles.saveButton} onClick={handleSave} disabled={saving}>
            {saving ? "กำลังบันทึก..." : "บันทึก"}
          </button>
          {!isNew && (
            <button type="button" className={formStyles.deleteButton} onClick={() => setConfirmOpen(true)}>
              ลบผลงานนี้
            </button>
          )}
        </div>
      </div>

      <AdminConfirmModal
        open={confirmOpen}
        message="ลบผลงานนี้ใช่หรือไม่?"
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
          if (shouldRedirect) router.push("/admin/portfolio");
        }}
      />
    </div>
  );
}
