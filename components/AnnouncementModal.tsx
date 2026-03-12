"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "zx-announcement-modal-dismissed";

/**
 * URL del botón "Shop Now". Cambia aquí o pasa la prop shopHref al componente.
 */
const DEFAULT_SHOP_URL = "/shop";

const DEFAULT_MODAL_IMAGE_URL =
  "https://zxline.us/wp-content/uploads/2026/02/close-up-sex-toys-1-scaled.jpg";

interface AnnouncementModalProps {
  /** URL de la imagen del modal (producto, logo o decorativa). */
  imageUrl?: string | null;
  /** URL del CTA "Shop Now". Por defecto: DEFAULT_SHOP_URL. */
  shopHref?: string;
}

export function AnnouncementModal({
  imageUrl,
  shopHref = DEFAULT_SHOP_URL,
}: AnnouncementModalProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (pathname !== "/") return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "true") return;
      setIsOpen(true);
    } catch {
      setIsOpen(true);
    }
  }, [pathname]);

  const close = (dontShowAgain?: boolean) => {
    if (dontShowAgain) {
      try {
        sessionStorage.setItem(STORAGE_KEY, "true");
      } catch {}
    }
    setIsOpen(false);
  };

  if (!isOpen) return null;

  const src = imageUrl?.trim() || DEFAULT_MODAL_IMAGE_URL;

  return (
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/40"
        aria-hidden
        onClick={() => close()}
      />
      <div
        className="fixed left-1/2 top-1/2 z-[71] flex max-h-[85dvh] w-[min(calc(100vw-1.5rem),36rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_25px_50px_-12px_rgba(0,0,0,0.2)] sm:flex-row"
        role="dialog"
        aria-modal="true"
        aria-labelledby="announcement-modal-title"
      >
        {/* Botón cerrar: X en círculo con borde (estilo referencia) */}
        <button
          type="button"
          onClick={() => close()}
          className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-600 shadow-sm transition hover:border-brand hover:bg-neutral-50 hover:text-brand"
          aria-label="Close"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Columna izquierda: imagen llenando todo el contenedor */}
        <div className="relative hidden bg-neutral-100 sm:block sm:w-[42%]">
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-center"
            sizes="320px"
          />
        </div>

        {/* Columna derecha: contenido */}
        <div className="flex flex-1 flex-col justify-between px-5 pb-6 pt-6 sm:px-8 sm:pb-10 sm:w-[58%]">
          <div>
            <p
              className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Promotion
            </p>
            <h2
              id="announcement-modal-title"
              className="mb-3 text-xl font-bold uppercase tracking-tight text-neutral-900 sm:text-2xl"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Free shipping
            </h2>
            <p className="mb-1 text-xs font-medium uppercase tracking-wider text-neutral-600">
              On your next purchase
            </p>
            <p className="mt-4 text-sm leading-relaxed text-neutral-700">
              <strong className="text-neutral-900">Free shipping on orders over $300.</strong>{" "}
              A minimum purchase of $40 is required to checkout. Taxes and shipping for
              smaller orders are calculated at the end.
            </p>
            <Link
              href={shopHref}
              onClick={() => close()}
              className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white transition hover:bg-brand-hover"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Shop Now
            </Link>
          </div>
          <label className="mt-6 flex cursor-pointer items-center gap-2 text-neutral-500">
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) close(true);
              }}
              className="h-4 w-4 rounded border-neutral-300 text-brand focus:ring-brand"
            />
            <span className="text-xs">Don&apos;t show this notice again</span>
          </label>
        </div>
      </div>
    </>
  );
}
