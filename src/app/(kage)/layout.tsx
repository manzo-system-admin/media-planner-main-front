export default function KageLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th">
      <body style={{ margin: 0, background: "#080808" }}>{children}</body>
    </html>
  );
}
