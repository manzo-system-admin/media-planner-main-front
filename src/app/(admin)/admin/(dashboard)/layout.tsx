import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth/getSessionUser";
import AdminShell from "@/components/admin/AdminShell";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");

  return (
    <AdminShell email={user.email} role={user.role}>
      {children}
    </AdminShell>
  );
}
