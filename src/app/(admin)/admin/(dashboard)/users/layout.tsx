import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { resolveRole } from "@/lib/auth/role";

export default async function UsersAdminOnlyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionCookie) redirect("/admin/login");

  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (resolveRole(decoded) !== "admin") redirect("/admin");
  } catch {
    redirect("/admin/login");
  }

  return children;
}
