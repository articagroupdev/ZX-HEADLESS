"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AccountDashboardContent } from "@/components/AccountDashboardContent";

type Customer = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  billing?: Record<string, string>;
  shipping?: Record<string, string>;
};

type Order = {
  id: number;
  status: string;
  total: string;
  date_created: string;
  line_items?: { name: string; quantity: number; total: string }[];
};

export default function DashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [meRes, ordersRes] = await Promise.all([
        fetch("/api/account/me"),
        fetch("/api/account/orders"),
      ]);
      if (meRes.status === 401 || ordersRes.status === 401) {
        if (!cancelled) router.replace("/account");
        return;
      }
      if (!meRes.ok) {
        if (!cancelled) router.replace("/account");
        return;
      }
      const me = await meRes.json();
      const orderList = ordersRes.ok ? await ordersRes.json() : [];
      if (!cancelled) {
        setCustomer(me);
        setOrders(Array.isArray(orderList) ? orderList : []);
      }
      if (!cancelled) setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  if (!customer) return null;

  return (
    <div className="min-h-[60vh] bg-neutral-50/50 px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-2xl">
        <h1
          className="mb-8 text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Mi cuenta
        </h1>
        <AccountDashboardContent customer={customer} orders={orders} />
      </div>
    </div>
  );
}
