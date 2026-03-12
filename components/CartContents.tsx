"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPriceFromMinorUnits } from "@/lib/store-api-types";

function MinusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function CartContents() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    isLoading,
    error,
    totals,
    shipping,
  } = useCart();

  if (isLoading && items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-20">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-neutral-200 border-t-brand" />
        <p className="mt-4 text-sm text-neutral-500">Loading cart…</p>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 pt-16 pb-24 sm:px-6 sm:pt-20">
        <h1
          className="mb-2 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Shopping Cart
        </h1>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-neutral-50/50 py-20"
        >
          <p className="text-lg text-neutral-500">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-brand px-8 text-sm font-medium text-white transition hover:brightness-110 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Shop now
          </Link>
        </motion.div>
        <p className="mt-8 text-center">
          <Link href="/shop" className="text-sm text-neutral-500 transition hover:text-neutral-900">
            ← Continue shopping
          </Link>
        </p>
      </div>
    );
  }

  const subtotal = items.reduce(
    (acc, i) => acc + parseFloat(i.price) * i.quantity,
    0
  );

  const minorUnit = totals?.currency_minor_unit ?? 2;
  const symbol = totals?.currency_symbol ?? "$";

  const subtotalFromTotals = totals
    ? formatPriceFromMinorUnits(totals.total_items, minorUnit)
    : subtotal.toFixed(2);

  const shippingAmount =
    totals && Number(totals.total_shipping) > 0
      ? formatPriceFromMinorUnits(totals.total_shipping, minorUnit)
      : shipping
        ? formatPriceFromMinorUnits(shipping.price, shipping.currency_minor_unit)
        : null;

  const extraDiffMinor =
    totals && Number(totals.total_price) > Number(totals.total_items)
      ? Number(totals.total_price) - Number(totals.total_items)
      : 0;
  const genericFeesAmount =
    totals && extraDiffMinor > Number(totals.total_shipping)
      ? formatPriceFromMinorUnits(
          extraDiffMinor - Number(totals.total_shipping ?? 0),
          minorUnit
        )
      : null;

  const totalAmount = totals
    ? formatPriceFromMinorUnits(totals.total_price, minorUnit)
    : subtotal.toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:py-16">
      <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
        <h1
          className="text-xl font-semibold tracking-tight text-neutral-900 sm:text-2xl md:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Shopping Cart
        </h1>
        <Link href="/shop" className="min-h-[44px] flex items-center text-sm text-neutral-500 transition hover:text-neutral-900" style={{ touchAction: "manipulation" }}>
          ← Continue shopping
        </Link>
      </div>

      {/* Dos columnas en md+; en móvil una columna (lista arriba, resumen abajo) */}
        <div className="cart-page-grid grid grid-cols-1 gap-6 md:grid-cols-[minmax(0,1fr),340px] md:items-start md:gap-8 lg:grid-cols-[minmax(0,1fr),360px] lg:gap-10">
          {/* Left: Product list */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            {error && (
              <div className="border-b border-neutral-100 bg-red-50/80 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {/* Cabecera tabla: solo en md+ */}
            <div className="hidden grid-cols-[1fr_auto_auto_auto] gap-3 border-b border-neutral-100 px-4 py-3 md:grid md:gap-6 md:px-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Product</span>
              <span className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 md:w-28">Quantity</span>
              <span className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500 md:w-24">Total</span>
              <span className="w-10 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Action</span>
            </div>
            <div className="divide-y divide-neutral-100">
              {items.map((item, index) => (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  className="cart-item-row flex flex-col gap-3 px-4 py-4 md:grid md:grid-cols-[1fr_auto_auto_auto] md:items-center md:gap-6 md:px-6 md:py-4"
                >
                  <div className="flex min-w-0 gap-3 sm:gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 sm:h-20 sm:w-20">
                      {item.imageSrc?.startsWith("http") ? (
                        <Image
                          src={item.imageSrc}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="80px"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs font-medium text-neutral-300" style={{ fontFamily: "var(--font-goldman), sans-serif" }}>
                          ZX
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium text-neutral-900 transition hover:text-brand"
                        style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-sm text-neutral-500">${item.price} each</p>
                      <p className="mt-1 text-sm font-medium text-neutral-900 md:hidden">
                        ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between gap-3 md:justify-end md:w-28">
                    <div className="flex min-w-0 flex-1 items-center rounded-full border border-neutral-200 bg-white md:flex-initial">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, Math.max(0, item.quantity - 1))}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-l-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                        aria-label="Disminuir cantidad"
                        style={{ touchAction: "manipulation" }}
                      >
                        <MinusIcon className="h-5 w-5" />
                      </button>
                      <span className="min-w-[2rem] flex-1 text-center text-sm font-medium text-neutral-900">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-r-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                        aria-label="Aumentar cantidad"
                        style={{ touchAction: "manipulation" }}
                      >
                        <PlusIcon className="h-5 w-5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-red-600 active:bg-neutral-100 md:hidden"
                      aria-label="Eliminar"
                      style={{ touchAction: "manipulation" }}
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="hidden w-24 text-right md:block">
                    <span className="text-sm font-medium text-neutral-900">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  <div className="hidden w-10 text-right md:block">
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-red-600"
                      aria-label="Eliminar"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="border-t border-neutral-100 px-4 py-4 md:px-6">
              <button
                type="button"
                className="min-h-[48px] w-full rounded-full bg-neutral-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-neutral-800 active:scale-[0.98] sm:w-auto sm:min-h-0 sm:py-2.5"
                style={{ fontFamily: "var(--font-goldman), sans-serif", touchAction: "manipulation" }}
              >
                Update Cart
              </button>
            </div>
          </motion.div>

        {/* Right: Order Summary */}
        <motion.aside
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="h-fit rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6 lg:sticky lg:top-24"
        >
          <h2
            className="mb-4 text-lg font-semibold tracking-tight text-neutral-900 sm:mb-6"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Order Summary
          </h2>
          <div className="mb-4 flex gap-2 sm:mb-6">
            <input
              type="text"
              placeholder="Discount voucher"
              className="min-h-[44px] min-w-0 flex-1 rounded-full border border-neutral-200 bg-white px-4 py-2.5 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              style={{ touchAction: "manipulation" }}
            />
            <button
              type="button"
              className="min-h-[44px] shrink-0 rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 active:bg-neutral-100"
              style={{ touchAction: "manipulation" }}
            >
              Apply
            </button>
          </div>
          <dl className="space-y-3 border-t border-neutral-100 pt-4">
            <div className="flex justify-between text-sm text-neutral-600">
              <dt>Sub Total</dt>
              <dd className="font-medium text-neutral-900">
                {symbol}
                {subtotalFromTotals}
              </dd>
            </div>
            {genericFeesAmount && (
              <div className="flex justify-between text-sm text-neutral-600">
                <dt>Fees</dt>
                <dd className="font-medium text-neutral-900">
                  {symbol}
                  {genericFeesAmount}
                </dd>
              </div>
            )}
            {shippingAmount && (
              <div className="flex justify-between text-sm text-neutral-600">
                <dt>{shipping?.name ?? "Shipping"}</dt>
                <dd className="font-medium text-neutral-900">
                  {symbol}
                  {shippingAmount}
                </dd>
              </div>
            )}
          </dl>
          <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4">
            <span
              className="font-semibold text-neutral-900"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Total
            </span>
            <span
              className="text-lg font-semibold text-neutral-900"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              {symbol}
              {totalAmount}
            </span>
          </div>
          <Link
            href="/checkout"
            className="mt-6 flex min-h-[48px] w-full items-center justify-center rounded-full bg-brand py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition hover:brightness-110 active:scale-[0.98]"
            style={{ fontFamily: "var(--font-goldman), sans-serif", touchAction: "manipulation" }}
          >
            Checkout Now
          </Link>
          <p className="mt-3 text-center text-xs text-neutral-400">
            You will enter your details on the next page.
          </p>
        </motion.aside>
      </div>
    </div>
  );
}
