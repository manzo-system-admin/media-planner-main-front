"use client";

import { useEffect, useState } from "react";
import AdminAlertModal, { type AdminAlertTone } from "@/components/admin/AdminAlertModal";
import DataTable, { type DataTableColumn } from "@/components/admin/DataTable";
import formStyles from "../news/[id]/page.module.css";

type Role = "admin" | "staff";
type UserRow = { uid: string; email: string; disabled: boolean; role: Role };

export default function UsersAdminPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{ message: string; tone: AdminAlertTone } | null>(null);
  const [busyUid, setBusyUid] = useState<string | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("staff");
  const [creating, setCreating] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    if (res.ok) setUsers(data.users);
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      await loadUsers();
    })();
  }, []);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "สร้างผู้ใช้งานไม่สำเร็จ");
      setAlert({ message: "เพิ่มผู้ใช้งานสำเร็จ", tone: "success" });
      setEmail("");
      setPassword("");
      setRole("staff");
      setShowForm(false);
      await loadUsers();
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "สร้างผู้ใช้งานไม่สำเร็จ", tone: "error" });
    } finally {
      setCreating(false);
    }
  };

  const patchUser = async (uid: string, patch: { role?: Role; disabled?: boolean }) => {
    setBusyUid(uid);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid, ...patch }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "อัปเดตไม่สำเร็จ");
      await loadUsers();
    } catch (err) {
      setAlert({ message: err instanceof Error ? err.message : "อัปเดตไม่สำเร็จ", tone: "error" });
    } finally {
      setBusyUid(null);
    }
  };

  const columns: DataTableColumn<UserRow>[] = [
    { key: "email", label: "อีเมล", render: (u) => u.email },
    {
      key: "role",
      label: "สิทธิ์",
      render: (u) => (u.role === "admin" ? "Admin" : "Staff"),
    },
    {
      key: "status",
      label: "สถานะ",
      render: (u) => (u.disabled ? "ปิดใช้งาน" : "ใช้งานอยู่"),
    },
  ];

  return (
    <div>
      <h1 className={formStyles.title}>ผู้ใช้งานหลังบ้าน</h1>
      <p style={{ marginBottom: 16, color: "var(--text-muted)", font: "400 13px var(--font-admin)" }}>
        Admin จัดการได้ทุกส่วนรวมถึงข้อมูลติดต่อ/หน้าเกี่ยวกับเรา และผู้ใช้งาน — Staff จัดการเนื้อหาทั่วไปได้แต่เข้าถึงส่วนนี้ไม่ได้
        การเปลี่ยนสิทธิ์จะมีผลเมื่อผู้ใช้งานนั้นเข้าสู่ระบบใหม่
      </p>

      {showForm && (
        <div className={formStyles.form} style={{ marginBottom: 20 }}>
          <div className={formStyles.row}>
            <div className={formStyles.field}>
              <label className={formStyles.label}>อีเมล</label>
              <input
                className={formStyles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={formStyles.field}>
              <label className={formStyles.label}>รหัสผ่าน (อย่างน้อย 8 ตัวอักษร)</label>
              <input
                className={formStyles.input}
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <div className={formStyles.field}>
            <label className={formStyles.label}>สิทธิ์</label>
            <select
              className={formStyles.input}
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="staff">Staff</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className={formStyles.actions}>
            <button type="button" className={formStyles.saveButton} onClick={handleCreate} disabled={creating}>
              {creating ? "กำลังบันทึก..." : "เพิ่มผู้ใช้งาน"}
            </button>
            <button type="button" className={formStyles.deleteButton} onClick={() => setShowForm(false)}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}

      <DataTable
        columns={columns}
        items={users}
        getRowId={(u) => u.uid}
        searchableText={(u) => u.email}
        onNewClick={() => setShowForm(true)}
        newLabel="+ เพิ่มผู้ใช้งาน"
        loading={loading}
        renderActions={(u) => (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              disabled={busyUid === u.uid}
              onClick={() => patchUser(u.uid, { role: u.role === "admin" ? "staff" : "admin" })}
              style={{
                font: "500 12px var(--font-admin)",
                color: "var(--grad-blue)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {u.role === "admin" ? "ลดเป็น Staff" : "เลื่อนเป็น Admin"}
            </button>
            <button
              type="button"
              disabled={busyUid === u.uid}
              onClick={() => patchUser(u.uid, { disabled: !u.disabled })}
              style={{
                font: "500 12px var(--font-admin)",
                color: u.disabled ? "var(--grad-green)" : "var(--grad-red)",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              {u.disabled ? "เปิดใช้งาน" : "ปิดใช้งาน"}
            </button>
          </div>
        )}
      />

      <AdminAlertModal
        open={!!alert}
        message={alert?.message ?? ""}
        tone={alert?.tone}
        onClose={() => setAlert(null)}
      />
    </div>
  );
}
