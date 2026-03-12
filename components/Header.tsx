"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useState, useEffect } from "react";

const LOGO_URL = "https://zxline.us/wp-content/uploads/2026/03/cropped-zx-512x512-1-e1772724043352-removebg-preview.png";

const nav = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
  { label: "ZX LINE", href: "/zx-line" },
  { label: "CONTACT", href: "/contact" },
];

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CartBagIcon({ className }: { className?: string }) {
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
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
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
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function Header() {
  const pathname = usePathname();
  const { totalItems, openDrawer } = useCart();
  const { productIds } = useFavorites();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const favoritesCount = productIds.length;

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white pt-[env(safe-area-inset-top)]">
      {/* Franja superior: rosa con iconos sociales — oculta en móvil para ganar espacio */}
      <div className="hidden bg-brand px-4 sm:block lg:px-12">
        <div className="mx-auto flex h-9 max-w-6xl items-center justify-end gap-5">
          <a
            href="https://www.instagram.com/zxline.us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition hover:opacity-80"
            aria-label="Instagram"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a
            href="https://www.tiktok.com/@zxline.us"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white transition hover:opacity-80"
            aria-label="TikTok"
          >
            <TikTokIcon className="h-4 w-4" />
          </a>
          <a
            href="mailto:info@zxline.us"
            className="text-white transition hover:opacity-80"
            aria-label="Email"
          >
            <EnvelopeIcon className="h-4 w-4" />
          </a>
        </div>
      </div>

      {/* Barra principal */}
      <div className="border-b border-neutral-200 px-4 sm:px-6 lg:px-12">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-2 sm:h-16">
          {/* Móvil: hamburguesa + logo + acciones */}
          <div className="flex min-w-0 flex-1 items-center gap-2 md:gap-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900 md:hidden"
              aria-label="Abrir menú"
            >
              <MenuIcon className="h-6 w-6" />
            </button>
            <nav
              className="hidden flex-1 items-center gap-0.5 md:flex lg:gap-1"
              aria-label="Principal"
            >
              {nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative flex items-center border-b-2 px-2 py-2.5 text-[11px] font-semibold uppercase tracking-[0.15em] transition-all duration-200 lg:px-3 lg:text-xs lg:tracking-[0.18em] ${
                      isActive
                        ? "border-brand text-brand"
                        : "border-transparent text-neutral-600 hover:border-neutral-300 hover:text-brand"
                    }`}
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex shrink-0 items-center justify-center px-2 sm:px-4 lg:px-8">
            <Link href="/" className="block">
              <Image
                src={LOGO_URL}
                alt="ZX LINE"
                width={80}
                height={80}
                className="h-11 w-auto object-contain sm:h-12 lg:h-14"
              />
            </Link>
          </div>

          <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
            <button
              type="button"
              onClick={openDrawer}
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-brand transition hover:bg-brand/10 sm:h-10 sm:w-10"
              aria-label={`Carrito${totalItems > 0 ? `, ${totalItems} productos` : ""}`}
            >
              <CartBagIcon className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white sm:-right-0.5 sm:-top-0.5">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </button>
            <Link
              href="/account/favorites"
              className="relative flex h-11 w-11 items-center justify-center rounded-lg text-brand transition hover:bg-brand/10 sm:h-10 sm:w-10"
              aria-label={favoritesCount > 0 ? `Favoritos, ${favoritesCount} productos` : "Favoritos"}
            >
              <HeartIcon className="h-6 w-6" />
              {favoritesCount > 0 && (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold text-white sm:-right-0.5 sm:-top-0.5">
                  {favoritesCount > 99 ? "99+" : favoritesCount}
                </span>
              )}
            </Link>
            <Link
              href="/account"
              className="flex h-11 w-11 items-center justify-center rounded-lg text-brand transition hover:bg-brand/10 sm:h-10 sm:w-10"
              aria-label="Mi cuenta"
            >
              <UserIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      </div>

      {/* Drawer menú móvil */}
      {mobileMenuOpen && (
        <>
          <div
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-[2px] md:hidden"
            aria-hidden
            onClick={() => setMobileMenuOpen(false)}
          />
          <div
            className="fixed left-0 top-0 z-[61] flex h-full w-[min(100vw-2rem,300px)] max-w-[85vw] flex-col border-r border-neutral-200 bg-white shadow-xl md:hidden"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
            role="dialog"
            aria-modal="true"
            aria-label="Menú de navegación"
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-4">
              <div className="relative flex flex-1 min-w-0 items-center gap-3">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={LOGO_URL}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-contain p-0.5"
                  />
                </div>
                <span
                  className="text-sm font-semibold uppercase tracking-wider text-neutral-500"
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  Menú
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
                aria-label="Cerrar menú"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col p-3" aria-label="Principal">
              {nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex min-h-[48px] items-center rounded-xl px-4 text-sm font-semibold uppercase tracking-wider transition ${
                      isActive
                        ? "bg-brand/10 text-brand"
                        : "text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100"
                    }`}
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-1 border-t border-neutral-100 px-3 pt-3">
              <Link
                href="/account/favorites"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-neutral-700 hover:bg-neutral-50"
              >
                <HeartIcon className="h-5 w-5 text-brand" />
                <span className="font-medium">Favoritos</span>
                {favoritesCount > 0 && (
                  <span className="ml-auto rounded-full bg-brand/15 px-2 py-0.5 text-xs font-semibold text-brand">
                    {favoritesCount}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="flex min-h-[48px] items-center gap-3 rounded-xl px-4 text-neutral-700 hover:bg-neutral-50"
              >
                <UserIcon className="h-5 w-5 text-brand" />
                <span className="font-medium">Mi cuenta</span>
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
