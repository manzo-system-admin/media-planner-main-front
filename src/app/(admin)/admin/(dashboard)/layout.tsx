import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getAdminAuth } from "@/lib/firebase/admin";
import { SESSION_COOKIE } from "@/lib/auth/session";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE)?.value;

  if (!sessionCookie) redirect("/admin/login");

  let email = "";
  try {
    const decoded = await getAdminAuth().verifySessionCookie(sessionCookie, true);
    if (decoded.admin !== true) redirect("/admin/login");
    email = decoded.email ?? "";
  } catch {
    redirect("/admin/login");
  }

  return <AdminShell email={email}>{children}</AdminShell>;
}
