import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { resolveRole, type AdminRole } from "@/lib/auth/role";

// Every handler below performs privileged Firebase Auth Admin SDK operations
// (listUsers/createUser/setCustomUserClaims/updateUser). The caller's role
// must always be re-verified server-side from the httpOnly session cookie —
// never trust a role/uid sent in the request body.
async function requireAdmin(): Promise<{ uid: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;
  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (resolveRole(decoded) !== "admin") return null;
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

export async function GET() {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const result = await getAdminAuth().listUsers(1000);
  const users = result.users.map((user) => ({
    uid: user.uid,
    email: user.email ?? "",
    disabled: user.disabled,
    role: resolveRole(user.customClaims ?? {}) ?? "staff",
  }));
  return NextResponse.json({ users });
}

export async function POST(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const role: AdminRole = body.role === "admin" ? "admin" : "staff";

  if (!email || password.length < 8) {
    return NextResponse.json(
      { error: "ต้องระบุอีเมลและรหัสผ่านอย่างน้อย 8 ตัวอักษร" },
      { status: 400 }
    );
  }

  try {
    const user = await getAdminAuth().createUser({ email, password });
    await getAdminAuth().setCustomUserClaims(user.uid, { role });
    return NextResponse.json({ ok: true, uid: user.uid });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "สร้างผู้ใช้งานไม่สำเร็จ" },
      { status: 400 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const caller = await requireAdmin();
  if (!caller) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const uid = typeof body.uid === "string" ? body.uid : "";
  if (!uid) return NextResponse.json({ error: "Missing uid" }, { status: 400 });

  if (uid === caller.uid && (body.role === "staff" || body.disabled === true)) {
    return NextResponse.json(
      { error: "ไม่สามารถลดสิทธิ์หรือปิดใช้งานบัญชีของตัวเองได้" },
      { status: 400 }
    );
  }

  try {
    if (body.role === "admin" || body.role === "staff") {
      await getAdminAuth().setCustomUserClaims(uid, { role: body.role });
    }
    if (typeof body.disabled === "boolean") {
      await getAdminAuth().updateUser(uid, { disabled: body.disabled });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "อัปเดตผู้ใช้งานไม่สำเร็จ" },
      { status: 400 }
    );
  }
}
