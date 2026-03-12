"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import type { WooProduct } from "@/lib/woocommerce";
import { AddToCartButton } from "@/components/AddToCartButton";
import { useFavorites } from "@/context/FavoritesContext";

interface ProductCardProps {
  product: WooProduct;
  index?: number;
}

function HeartIcon({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
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

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { isFavorite, toggleFavorite, isLoading } = useFavorites();
  const image =
    product.image?.src ? product.image : product.images?.[0];
  const imageSrc = image?.src?.startsWith("http") ? image.src : null;
  const price = product.price ?? product.regular_price;
  const favorited = isFavorite(product.id);

  return (
    <motion.article
      className="group flex aspect-[3/4] w-full touch-pan-y flex-col overflow-hidden rounded-2xl border-2 border-brand/30 bg-white shadow-lg transition hover:border-brand hover:shadow-xl sm:aspect-[3/4]"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      whileHover={{ y: -4 }}
    >
      {/* Zona superior: imagen grande que sobresale */}
      <Link
        href={`/product/${product.slug}`}
        className="relative flex min-h-0 flex-[1] touch-pan-y items-center justify-center overflow-hidden bg-neutral-50 sm:bg-white"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={image?.alt || product.name}
            fill
            className="object-contain object-center transition duration-300 group-hover:scale-105 sm:object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 45vw, 25vw"
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
              ZX LINE
            </span>
            <span className="line-clamp-2 text-sm text-neutral-500">
              {product.name}
            </span>
          </div>
        )}
        <button
          type="button"
          disabled={isLoading}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full text-neutral-800/80 transition hover:bg-white/90 hover:text-brand active:scale-95 disabled:opacity-60 sm:right-3 sm:top-3"
          aria-label={favorited ? "Quitar de favoritos" : "Añadir a favoritos"}
        >
          <HeartIcon
            className={`h-4 w-4 ${favorited ? "text-brand" : ""}`}
            filled={favorited}
          />
        </button>
      </Link>

      {/* Zona inferior: fondo blanco, texto y CTA */}
      <div className="relative flex shrink-0 flex-col justify-between border-t border-neutral-100 bg-white px-2.5 py-1.5 sm:px-4 sm:py-3">
        <div className="min-w-0">
          <h3
            className="line-clamp-2 text-xs font-bold leading-tight text-neutral-900 sm:text-sm"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            {product.name}
          </h3>
          <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-neutral-500 sm:text-xs">
            ZX LINE
          </p>
          <p className="mt-0.5 text-base font-bold text-brand sm:mt-1 sm:text-lg">
            ${price}
            <span className="ml-1 text-xs font-normal text-neutral-500">
              +Taxes
            </span>
          </p>
        </div>
        <div className="mt-1 flex min-h-[40px] items-center justify-end gap-1.5 sm:mt-2 sm:min-h-[44px] sm:gap-2">
          <Link
            href={`/product/${product.slug}`}
            className="flex items-center self-stretch py-2 text-xs font-medium text-neutral-500 underline-offset-2 hover:text-brand hover:underline sm:py-0"
          >
            Ver detalle
          </Link>
          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              slug: product.slug,
              price,
              imageSrc,
            }}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-brand transition hover:bg-brand/10 hover:text-brand active:scale-95"
            aria-label="Añadir al carrito"
          >
            <CartBagIcon className="h-5 w-5" />
          </AddToCartButton>
        </div>
      </div>
    </motion.article>
  );
}
