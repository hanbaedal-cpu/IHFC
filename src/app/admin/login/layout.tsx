export default function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div style={{ gridColumn: "1 / -1" }}>{children}</div>;
}
