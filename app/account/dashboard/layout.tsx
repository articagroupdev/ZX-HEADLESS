import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mi cuenta",
  description: "Tu perfil, pedidos y direcciones",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
