"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pendiente",
  processing: "Procesando",
  "on-hold": "En espera",
  completed: "Completado",
  cancelled: "Cancelado",
  refunded: "Reembolsado",
  failed: "Fallido",
};

export function AccountPanel() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [meRes, ordersRes] = await Promise.all([
          fetch("/api/account/me"),
          fetch("/api/account/orders"),
        ]);
        if (meRes.status === 401 || ordersRes.status === 401) {
          if (!cancelled) setCustomer(null);
          return;
        }
        if (!meRes.ok) {
          if (!cancelled) setError("Error al cargar la cuenta");
          return;
        }
        const me = await meRes.json();
        const orderList = ordersRes.ok ? await ordersRes.json() : [];
        if (!cancelled) {
          setCustomer(me);
          setOrders(Array.isArray(orderList) ? orderList : []);
        }
      } catch {
        if (!cancelled) setError("Error de conexión");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.refresh();
    setCustomer(null);
    setOrders([]);
  }

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-neutral-500">Cargando...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-6 text-center text-red-700">
        {error}
      </div>
    );
  }

  if (!customer) {
    return (
      <section className="rounded-xl border border-neutral-200 p-6">
        <p className="mb-4 font-medium text-neutral-900">
          Para ver tu perfil, pedidos y direcciones, inicia sesión o crea una
          cuenta.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/account"
            className="rounded-lg border border-brand bg-white px-4 py-2.5 text-sm font-semibold text-brand transition hover:bg-brand/5"
          >
            Iniciar sesión
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
          >
            Crear cuenta
          </Link>
        </div>
      </section>
    );
  }

  const fullName = [customer.first_name, customer.last_name]
    .filter(Boolean)
    .join(" ") || customer.username || "Usuario";
  const billing = customer.billing ?? {};
  const shipping = customer.shipping ?? {};

  const formatAddress = (addr: Record<string, string>) => {
    const parts = [
      addr.address_1,
      addr.address_2,
      [addr.city, addr.state, addr.postcode].filter(Boolean).join(", "),
      addr.country,
    ].filter(Boolean);
    return parts.length ? parts.join(", ") : "—";
  };

  return (
    <div className="space-y-8">
      {/* Perfil */}
      <section className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
        <h2
          className="mb-4 text-lg font-semibold text-neutral-900"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Perfil
        </h2>
        <dl className="grid gap-2 text-sm">
          <div>
            <dt className="text-neutral-500">Nombre</dt>
            <dd className="font-medium text-neutral-900">{fullName}</dd>
          </div>
          <div>
            <dt className="text-neutral-500">Correo</dt>
            <dd className="font-medium text-neutral-900">{customer.email}</dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={handleLogout}
          className="mt-4 text-sm text-neutral-500 underline hover:text-neutral-700"
        >
          Cerrar sesión
        </button>
      </section>

      {/* Pedidos */}
      <section className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
        <h2
          className="mb-4 text-lg font-semibold text-neutral-900"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Pedidos
        </h2>
        {orders.length === 0 ? (
          <p className="text-sm text-neutral-500">Aún no tienes pedidos.</p>
        ) : (
          <ul className="space-y-3">
            {orders.map((order) => (
              <li
                key={order.id}
                className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-100 pb-3 last:border-0"
              >
                <div>
                  <span className="font-medium text-neutral-900">
                    #{order.id}
                  </span>
                  <span className="ml-2 text-neutral-500">
                    {new Date(order.date_created).toLocaleDateString("es")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="rounded bg-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-700">
                    {STATUS_LABELS[order.status] ?? order.status}
                  </span>
                  <span className="font-semibold text-neutral-900">
                    {order.total}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Direcciones */}
      <section className="rounded-xl border border-neutral-200 bg-neutral-50/50 p-6">
        <h2
          className="mb-4 text-lg font-semibold text-neutral-900"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Direcciones
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-1 text-sm font-medium text-neutral-500">
              Facturación
            </h3>
            <p className="text-sm text-neutral-900 whitespace-pre-line">
              {formatAddress(billing)}
            </p>
          </div>
          <div>
            <h3 className="mb-1 text-sm font-medium text-neutral-500">
              Envío
            </h3>
            <p className="text-sm text-neutral-900 whitespace-pre-line">
              {formatAddress(shipping)}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
