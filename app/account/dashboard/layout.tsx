import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your profile, orders and addresses.",
  robots: { index: false, follow: false },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
