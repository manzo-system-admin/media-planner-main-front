import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Backoffice | Media Planner Consultant",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body>{children}</body>
    </html>
  );
}
