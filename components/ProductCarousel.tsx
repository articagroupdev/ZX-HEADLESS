"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { WooProduct } from "@/lib/woocommerce";
import { ProductCard } from "@/components/ProductCard";

function PrevIcon({ className }: { className?: string }) {
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
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function NextIcon({ className }: { className?: string }) {
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
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

interface ProductCarouselProps {
  products: WooProduct[];
}

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    loop: true,
    align: "start",
    skipSnaps: false,
    dragFree: false,
    dragThreshold: 15,
  });

  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollButtons = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    updateScrollButtons();
    emblaApi.on("select", updateScrollButtons);
    emblaApi.on("reInit", updateScrollButtons);
    return () => {
      emblaApi.off("select", updateScrollButtons);
      emblaApi.off("reInit", updateScrollButtons);
    };
  }, [emblaApi, updateScrollButtons]);

  if (products.length === 0) return null;

  return (
    <div className="relative">
      <div
        ref={emblaRef}
        className="overflow-hidden py-3"
      >
        <div className="flex cursor-grab touch-pan-y active:cursor-grabbing sm:touch-pan-x gap-3 sm:gap-6 md:gap-8 lg:gap-10">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_78%] px-0.5 sm:flex-[0_0_48%] sm:px-1 md:flex-[0_0_32%] lg:flex-[0_0_23%] lg:px-2"
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>
      </div>

      {products.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2 sm:mt-8 sm:gap-3">
          <button
            type="button"
            onClick={() => emblaApi?.scrollPrev()}
            disabled={!canScrollPrev}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-neutral-200 text-neutral-600 transition hover:border-brand hover:bg-brand/5 hover:text-brand active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Previous products"
          >
            <PrevIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={() => emblaApi?.scrollNext()}
            disabled={!canScrollNext}
            className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-neutral-200 text-neutral-600 transition hover:border-brand hover:bg-brand/5 hover:text-brand active:scale-95 disabled:pointer-events-none disabled:opacity-40"
            aria-label="Next products"
          >
            <NextIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
