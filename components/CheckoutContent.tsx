"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPriceFromMinorUnits } from "@/lib/store-api-types";

export function CheckoutContent() {
  const { items, totalItems, isLoading, totals, shipping } = useCart();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-brand" />
        <p className="mt-5 text-sm text-neutral-500">Loading…</p>
      </div>
    );
  }

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-lg px-4 pt-24 pb-32">
        <h1
          className="mb-4 text-2xl font-semibold tracking-tight text-brand"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Checkout
        </h1>
        <div className="rounded-2xl border border-neutral-100 bg-white p-12 text-center">
          <p className="text-neutral-500">Your cart is empty.</p>
          <Link
            href="/shop"
            className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand px-8 text-sm font-medium text-white transition hover:brightness-110"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Continue shopping
          </Link>
        </div>
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
    totals && extraDiffMinor > Number(totals.total_shipping ?? 0)
      ? formatPriceFromMinorUnits(
          extraDiffMinor - Number(totals.total_shipping ?? 0),
          minorUnit
        )
      : null;

  const totalAmount = totals
    ? formatPriceFromMinorUnits(totals.total_price, minorUnit)
    : subtotal.toFixed(2);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:py-16">
      <div className="mb-8 sm:mb-10">
        <Link
          href="/cart"
          className="inline-flex min-h-[44px] items-center text-sm text-neutral-500 transition hover:text-neutral-900"
        >
          ← Back to cart
        </Link>
        <h1
          className="mt-3 text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Checkout
        </h1>
        <p className="mt-1 text-sm text-neutral-500">Complete your order securely.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr),400px] lg:items-start lg:gap-12">
        {/* Left: Form */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="space-y-6 sm:space-y-8"
        >
          {/* Contact */}
          <section className="rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8">
            <h2
              className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Contact
            </h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="checkout-email" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  id="checkout-email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8">
            <h2
              className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Shipping address
            </h2>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="checkout-first" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    First name
                  </label>
                  <input
                    id="checkout-first"
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-last" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Last name
                  </label>
                  <input
                    id="checkout-last"
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="checkout-address" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Address
                </label>
                <input
                  id="checkout-address"
                  type="text"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="checkout-city" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    City
                  </label>
                  <input
                    id="checkout-city"
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-state" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    State / Province
                  </label>
                  <input
                    id="checkout-state"
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
                <div>
                  <label htmlFor="checkout-zip" className="mb-1.5 block text-sm font-medium text-neutral-700">
                    ZIP / Postal code
                  </label>
                  <input
                    id="checkout-zip"
                    type="text"
                    className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="checkout-country" className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Country
                </label>
                <input
                  id="checkout-country"
                  type="text"
                  className="h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
          </section>
        </motion.div>

        {/* Right: Order summary */}
        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.05 }}
          className="lg:sticky lg:top-24"
        >
          <div className="rounded-2xl border border-neutral-100 bg-white p-6 sm:p-8">
            <h2
              className="mb-6 text-sm font-semibold uppercase tracking-[0.2em] text-brand"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Order summary
            </h2>
            <ul className="divide-y divide-neutral-100">
              {items.map((item) => (
                <li key={item.key} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                  <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-neutral-50">
                    {item.imageSrc?.startsWith("http") ? (
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="64px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs font-medium text-neutral-300" style={{ fontFamily: "var(--font-goldman), sans-serif" }}>
                        ZX
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-900">{item.name}</p>
                    <p className="text-xs text-neutral-500">
                      {item.quantity} × ${item.price}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-medium text-neutral-900">
                    ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 border-t border-neutral-100 pt-6">
              <div className="flex justify-between text-sm text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {symbol}
                  {subtotalFromTotals}
                </span>
              </div>
              {genericFeesAmount && (
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Fees</span>
                  <span className="font-medium text-neutral-900">
                    {symbol}
                    {genericFeesAmount}
                  </span>
                </div>
              )}
              {shippingAmount && (
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>{shipping?.name ?? "Shipping"}</span>
                  <span className="font-medium text-neutral-900">
                    {symbol}
                    {shippingAmount}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-4 flex justify-between border-t border-neutral-100 pt-4">
              <span className="font-semibold text-neutral-900" style={{ fontFamily: "var(--font-goldman), sans-serif" }}>
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
            <button
              type="button"
              disabled
              className="mt-8 flex min-h-[52px] w-full items-center justify-center rounded-full bg-neutral-900 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              title="Checkout coming soon"
            >
              Place order
            </button>
            <p className="mt-3 text-center text-xs text-neutral-400">
              Payment and order placement will be available soon.
            </p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
