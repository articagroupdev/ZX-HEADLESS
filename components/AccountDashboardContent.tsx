"use client";

import Link from "next/link";
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

const STATUS_COLORS: Record<string, string> = {
  completed: "bg-emerald-100 text-emerald-800",
  processing: "bg-amber-100 text-amber-800",
  pending: "bg-neutral-100 text-neutral-700",
  "on-hold": "bg-amber-50 text-amber-700",
  cancelled: "bg-red-50 text-red-700",
  refunded: "bg-sky-50 text-sky-700",
  failed: "bg-red-100 text-red-800",
};

interface AccountDashboardContentProps {
  customer: Customer;
  orders: Order[];
}

function formatAddress(addr: Record<string, string>) {
  const parts = [
    addr.address_1,
    addr.address_2,
    [addr.city, addr.state, addr.postcode].filter(Boolean).join(", "),
    addr.country,
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

export function AccountDashboardContent({
  customer,
  orders,
}: AccountDashboardContentProps) {
  const router = useRouter();
  const fullName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.username ||
    "Usuario";
  const billing = customer.billing ?? {};
  const shipping = customer.shipping ?? {};

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/account");
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Header con saludo y cerrar sesión */}
      <div className="flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-neutral-500">Bienvenido,</p>
          <p
            className="text-xl font-semibold text-neutral-900"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            {fullName}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/account/favorites"
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            Favoritos
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-neutral-300 bg-white px-4 py-2 text-sm font-medium text-neutral-600 transition hover:bg-neutral-50 hover:text-neutral-900"
          >
            Cerrar sesión
          </button>
        </div>
      </div>

      {/* Perfil */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
          <h2
            className="text-sm font-semibold uppercase tracking-wider text-neutral-600"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Perfil
          </h2>
        </div>
        <div className="p-5">
          <dl className="grid gap-4 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Nombre
              </dt>
              <dd className="mt-0.5 font-medium text-neutral-900">{fullName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wider text-neutral-400">
                Correo
              </dt>
              <dd className="mt-0.5 font-medium text-neutral-900">
                {customer.email}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* Pedidos */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
          <h2
            className="text-sm font-semibold uppercase tracking-wider text-neutral-600"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Pedidos
          </h2>
        </div>
        <div className="p-5">
          {orders.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              Aún no tienes pedidos.
            </p>
          ) : (
            <ul className="divide-y divide-neutral-100">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-col gap-2 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-neutral-900">
                      #{order.id}
                    </span>
                    <span className="text-sm text-neutral-500">
                      {new Date(order.date_created).toLocaleDateString("es", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[order.status] ?? "bg-neutral-100 text-neutral-700"
                      }`}
                    >
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
        </div>
      </section>

      {/* Direcciones */}
      <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-100 bg-neutral-50/80 px-5 py-3">
          <h2
            className="text-sm font-semibold uppercase tracking-wider text-neutral-600"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Direcciones
          </h2>
        </div>
        <div className="grid gap-6 p-5 sm:grid-cols-2">
          <div className="rounded-xl bg-neutral-50/50 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Facturación
            </h3>
            <p className="text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
              {formatAddress(billing)}
            </p>
          </div>
          <div className="rounded-xl bg-neutral-50/50 p-4">
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Envío
            </h3>
            <p className="text-sm leading-relaxed text-neutral-900 whitespace-pre-line">
              {formatAddress(shipping)}
            </p>
          </div>
        </div>
      </section>

      <p className="text-center">
        <Link
          href="/"
          className="text-sm text-neutral-500 underline hover:text-neutral-700"
        >
          ← Volver al inicio
        </Link>
      </p>
    </div>
  );
}
