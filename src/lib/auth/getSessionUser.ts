import "server-only";
import { cookies } from "next/headers";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { resolveRole, type AdminRole } from "@/lib/auth/role";

export type SessionUser = { email: string; role: AdminRole };

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) return null;

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    const role = resolveRole(decoded);
    if (!role) return null;
    return { email: decoded.email ?? "", role };
  } catch {
    return null;
  }
}
