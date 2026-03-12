"use client";

import Image from "next/image";
import Link from "next/link";
import type { WooProduct } from "@/lib/woocommerce";
import { AddToCartButton } from "@/components/AddToCartButton";

interface RelatedProductsProps {
  products: WooProduct[];
}

function CartIcon({ className }: { className?: string }) {
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

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section
      className="border-t border-neutral-100 bg-neutral-50/30 py-12 sm:py-16 lg:py-20"
      aria-labelledby="related-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-12">
        <h2
          id="related-heading"
          className="mb-8 text-lg font-semibold tracking-tight text-neutral-900 sm:mb-10 sm:text-xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          You may also like
        </h2>

        <ul className="grid grid-cols-2 gap-4 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => {
            const image =
              product.image?.src ? product.image : product.images?.[0];
            const imageSrc =
              image?.src?.startsWith("http") ? image.src : null;
            const price = product.price ?? product.regular_price;

            return (
              <li key={product.id}>
                <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/80 bg-white transition hover:border-neutral-300">
                  <Link
                    href={`/product/${product.slug}`}
                    className="relative block flex-1 overflow-hidden bg-white"
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-neutral-50 pt-6">
                      {imageSrc ? (
                        <Image
                          src={imageSrc}
                          alt={image?.alt || product.name}
                          fill
                          className="object-cover object-top transition duration-300 group-hover:scale-[1.02]"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                          unoptimized
                        />
                      ) : (
                        <div className="flex h-full flex-col items-center justify-center gap-1 p-4 text-center">
                          <span className="text-[10px] font-semibold uppercase tracking-widest text-neutral-400">
                            ZX LINE
                          </span>
                          <span className="line-clamp-2 text-xs text-neutral-500">
                            {product.name}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="border-t border-neutral-100 bg-white p-3 sm:p-4">
                      <h3
                        className="line-clamp-2 text-sm font-medium leading-tight text-neutral-900 transition group-hover:text-neutral-700"
                        style={{
                          fontFamily: "var(--font-goldman), sans-serif",
                        }}
                      >
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-base font-semibold text-brand">
                        ${price}
                        <span className="ml-0.5 text-xs font-normal text-neutral-500">
                          +Taxes
                        </span>
                      </p>
                    </div>
                  </Link>
                  <div className="flex justify-end border-t border-neutral-100 p-2 pr-3 sm:p-3">
                    <AddToCartButton
                      product={{
                        id: product.id,
                        name: product.name,
                        slug: product.slug,
                        price,
                        imageSrc: imageSrc ?? null,
                      }}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-500 transition hover:bg-brand/10 hover:text-brand active:scale-95"
                      aria-label={`Añadir ${product.name} al carrito`}
                    >
                      <CartIcon className="h-4 w-4" />
                    </AddToCartButton>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
