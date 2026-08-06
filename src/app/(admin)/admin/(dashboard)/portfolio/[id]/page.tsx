"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, updateDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase/client";
import { getNextOrder, logActivity, softDeleteDoc } from "@/lib/admin/adminData";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import AdminConfirmModal from "@/components/admin/AdminConfirmModal";
import MultiImageUploader from "@/components/admin/MultiImageUploader";
import RichTextEditor from "@/components/admin/RichTextEditor";
import SearchableSelect from "@/components/admin/SearchableSelect";
import { toText } from "@/lib/cms/types";
import type { PortfolioDoc, PortfolioStatDoc } from "@/lib/cms/portfolio";
import type { ClientDoc } from "@/lib/cms/org";

import formStyles from "../../news/[id]/page.module.css";

type FormState = Omit<PortfolioDoc, "id">;

const EMPTY: FormState = {
  clientId: "",
  images: [],
  order: 0,
  title: "",
  stats: [],
  description: "",
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
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 8, alignItems: "center" }}
        >
          <input
            className={formStyles.input}
            placeholder="ป้ายกำกับ"
            value={stat.label}
            onChange={(e) => update(index, { label: e.target.value })}
          />
          <input
            className={formStyles.input}
            placeholder="ค่า (เช่น +32%)"
            value={stat.value}
            onChange={(e) => update(index, { value: e.target.value })}
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
        onClick={() => onChange([...stats, { label: "", value: "" }])}
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
  const [clients, setClients] = useState<{ id: string; name: string }[]>([]);

  useEffect(() => {
    (async () => {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), "clients"), orderBy("order", "asc")));
      const list = snapshot.docs
        .filter((d) => !d.data().deleted)
        .map((d) => {
          const data = d.data() as Omit<ClientDoc, "id">;
          return { id: d.id, name: data.name };
        });
      setClients(list);
      if (isNew && list.length > 0) {
        setForm((f) => (f.clientId ? f : { ...f, clientId: list[0].id }));
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
      if (snapshot.exists()) {
        const data = snapshot.data() as FormState & { image?: string };
        // Older docs stored a single `image` string — migrate it into `images` on load.
        const images = data.images ?? (data.image ? [data.image] : []);
        const stats = (data.stats ?? []).map((stat) => ({
          label: toText(stat.label),
          value: toText(stat.value),
        }));
        setForm({ ...EMPTY, ...data, images, title: toText(data.title), stats });
      }
      setLoading(false);
    })();
  }, [isNew, params.id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (isNew) {
        await addDoc(collection(getFirebaseDb(), "portfolio"), form);
        await logActivity("create", "ผลงาน/เคส", form.title);
      } else {
        await updateDoc(doc(getFirebaseDb(), "portfolio", params.id), { ...form });
        await logActivity("update", "ผลงาน/เคส", form.title);
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
    await softDeleteDoc("portfolio", params.id, "ผลงาน/เคส", form.title);
    setDeleting(false);
    setConfirmOpen(false);
    setAlert({ message: "ลบสำเร็จ", tone: "success", redirect: true });
  };

  if (loading) return <p>กำลังโหลด...</p>;

  return (
    <div>
      <h1 className={formStyles.title}>{isNew ? "เพิ่มผลงานใหม่" : "แก้ไขผลงาน"}</h1>

      <div className={formStyles.form}>
        <div className={formStyles.field}>
          <label className={formStyles.label}>ลำดับ</label>
          <input
            type="number"
            className={formStyles.input}
            value={form.order ?? 0}
            onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>ลูกค้า</label>
          <SearchableSelect
            options={clients.map((client) => ({ value: client.id, label: client.name }))}
            value={form.clientId ?? ""}
            onChange={(clientId) => setForm({ ...form, clientId })}
            placeholder="ค้นหาลูกค้า..."
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>รูปภาพ (รูปแรกจะใช้เป็นภาพปก)</label>
          <MultiImageUploader
            values={form.images}
            onChange={(images) => setForm({ ...form, images })}
            folder="portfolio"
          />
        </div>

        <div className={formStyles.field}>
          <label className={formStyles.label}>ชื่อผลงาน</label>
          <input
            className={formStyles.input}
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <StatsEditor stats={form.stats} onChange={(stats) => setForm({ ...form, stats })} />

        <div className={formStyles.field}>
          <span className={formStyles.langLabel}>รายละเอียดผลงาน (ไทย)</span>
          <RichTextEditor
            value={form.description ?? ""}
            onChange={(html) => setForm({ ...form, description: html })}
          />
        </div>

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
