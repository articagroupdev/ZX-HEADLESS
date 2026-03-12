"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPriceFromMinorUnits } from "@/lib/store-api-types";

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}

export function CartDrawer() {
  const {
    items,
    removeItem,
    updateQuantity,
    totalItems,
    isDrawerOpen,
    closeDrawer,
    isLoading,
    error,
    totals,
    shipping,
  } = useCart();

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isDrawerOpen]);

  const subtotalFallback = items.reduce(
    (acc, i) => acc + parseFloat(i.price) * i.quantity,
    0
  );

  const minorUnit = totals?.currency_minor_unit ?? 2;
  const symbol = totals?.currency_symbol ?? "$";

  const subtotalFromTotals = totals
    ? formatPriceFromMinorUnits(totals.total_items, minorUnit)
    : subtotalFallback.toFixed(2);

  const feesAmount =
    totals && Number(totals.total_fees) > 0
      ? formatPriceFromMinorUnits(totals.total_fees, minorUnit)
      : null;

  const shippingAmount =
    totals && Number(totals.total_shipping) > 0
      ? formatPriceFromMinorUnits(totals.total_shipping, minorUnit)
      : shipping
        ? formatPriceFromMinorUnits(shipping.price, shipping.currency_minor_unit)
        : null;

  // Si WooCommerce no desglosa shipping/fees pero el total es mayor que el subtotal,
  // mostramos una fila genérica de "Fees" con la diferencia.
  const extraDiffMinor =
    totals && Number(totals.total_price) > Number(totals.total_items)
      ? Number(totals.total_price) - Number(totals.total_items)
      : 0;
  const genericFeesAmount =
    !feesAmount && !shippingAmount && extraDiffMinor > 0
      ? formatPriceFromMinorUnits(extraDiffMinor, minorUnit)
      : null;

  const totalAmount = totals
    ? formatPriceFromMinorUnits(totals.total_price, minorUnit)
    : subtotalFallback.toFixed(2);

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            aria-hidden
            onClick={closeDrawer}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className="fixed right-0 top-0 z-[101] flex h-full w-full max-w-[400px] flex-col bg-white shadow-2xl sm:max-w-[400px] [padding-left:env(safe-area-inset-left)] [padding-right:env(safe-area-inset-right)]"
            role="dialog"
            aria-modal="true"
            aria-label="Carrito"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{
              type: "tween",
              duration: 0.35,
              ease: [0.32, 0.72, 0, 1],
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 sm:px-5 sm:py-4">
              <h2
                className="text-sm font-bold uppercase tracking-[0.2em] text-neutral-900 sm:text-base"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Your cart
                {totalItems > 0 && (
                  <span className="ml-1.5 text-brand">
                    ({totalItems})
                  </span>
                )}
              </h2>
              <button
                type="button"
                onClick={closeDrawer}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Cerrar carrito"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-5">
              {error && (
                <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </p>
              )}
              {isLoading && items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-sm text-neutral-500">Loading cart…</p>
                </div>
              ) : totalItems === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="9" cy="21" r="1" />
                      <circle cx="20" cy="21" r="1" />
                      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                    </svg>
                  </div>
                  <p className="mb-1 text-sm font-medium text-neutral-700">
                    Your cart is empty
                  </p>
                  <p className="mb-6 text-xs text-neutral-500">
                    Add something you like and it will show up here.
                  </p>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
                  >
                    Continue shopping
                  </button>
                </div>
              ) : (
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li
                      key={item.key}
                      className="flex gap-3 rounded-xl border border-neutral-100 bg-neutral-50/50 p-3 transition hover:border-neutral-200"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white shadow-sm">
                        {item.imageSrc?.startsWith("http") ? (
                          <Image
                            src={item.imageSrc}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="72px"
                            unoptimized
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-[10px] font-semibold uppercase tracking-wider text-neutral-300">
                            ZX
                          </div>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={closeDrawer}
                          className="text-sm font-medium text-neutral-900 line-clamp-2 hover:text-brand"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-neutral-500">
                          ${item.price}
                        </p>
                        <div className="mt-2 flex items-center gap-1.5">
                          <div className="flex items-center rounded-full border border-neutral-200 bg-white">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.key,
                                  Math.max(0, item.quantity - 1)
                                )
                              }
                              className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-l-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] py-1 text-center text-xs font-medium text-neutral-900">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="flex h-9 min-w-[2.25rem] items-center justify-center rounded-r-full text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-900 active:bg-neutral-100"
                            >
                              +
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className="ml-1 flex items-center gap-1 rounded p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600"
                            aria-label="Eliminar"
                          >
                            <TrashIcon className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-neutral-900">
                          $
                          {(
                            parseFloat(item.price) * item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {totalItems > 0 && (
              <div className="border-t border-neutral-100 bg-neutral-50/30 px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
                <div className="mb-2 flex items-baseline justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-500"
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    Subtotal
                  </span>
                  <span className="text-sm font-semibold text-neutral-900">
                    {symbol}
                    {subtotalFromTotals}
                  </span>
                </div>

                {(feesAmount || genericFeesAmount) && (
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="text-neutral-500">Fees</span>
                    <span className="font-medium text-neutral-900">
                      {symbol}
                      {feesAmount ?? genericFeesAmount}
                    </span>
                  </div>
                )}

                {shippingAmount && (
                  <div className="mb-2 flex items-baseline justify-between text-xs">
                    <span className="text-neutral-500">
                      {shipping?.name ?? "Shipping"}
                    </span>
                    <span className="font-medium text-neutral-900">
                      {symbol}
                      {shippingAmount}
                    </span>
                  </div>
                )}

                <div className="mb-3 flex items-baseline justify-between">
                  <span
                    className="text-xs font-semibold uppercase tracking-wider text-neutral-800"
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    Total
                  </span>
                  <span className="text-lg font-bold text-neutral-900">
                    {symbol}
                    {totalAmount}
                  </span>
                </div>

                <p className="mb-4 text-[10px] text-neutral-400">
                  Taxes calculated at checkout
                </p>
                <div className="flex flex-col gap-2">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="block rounded-full bg-brand py-3.5 text-center text-xs font-semibold uppercase tracking-wider text-white transition hover:brightness-110"
                  >
                    View cart
                  </Link>
                  <button
                    type="button"
                    onClick={closeDrawer}
                    className="rounded-full border-2 border-neutral-200 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-600 transition hover:border-brand hover:bg-brand/5 hover:text-brand"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
