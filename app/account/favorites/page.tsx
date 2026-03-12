"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useFavorites } from "@/context/FavoritesContext";
import { ProductCard } from "@/components/ProductCard";
import type { WooProduct } from "@/lib/woocommerce";

export default function FavoritesPage() {
  const { productIds, isLoading } = useFavorites();
  const [products, setProducts] = useState<WooProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    if (productIds.length === 0) {
      setProducts([]);
      setLoadingProducts(false);
      return;
    }
    let cancelled = false;
    setLoadingProducts(true);
    fetch(`/api/products?ids=${productIds.join(",")}`)
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingProducts(false);
      });
    return () => {
      cancelled = true;
    };
  }, [productIds.join(",")]);

  const loading = isLoading || loadingProducts;

  return (
    <div className="min-h-[60vh] bg-neutral-50/50 px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <h1
          className="mb-6 text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:mb-10 sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Favoritos
        </h1>

        {loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
            <p className="mb-4 text-neutral-600">
              Aún no tienes productos en favoritos.
            </p>
            <Link
              href="/shop"
              className="inline-block rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, index) => (
              <li key={product.id}>
                <ProductCard product={product} index={index} />
              </li>
            ))}
          </ul>
        )}

        <p className="mt-8 text-center">
          <Link
            href="/account/dashboard"
            className="text-sm text-neutral-500 underline hover:text-neutral-700"
          >
            ← Volver a Mi cuenta
          </Link>
        </p>
      </div>
    </div>
  );
}
