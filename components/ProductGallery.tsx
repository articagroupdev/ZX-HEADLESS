"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { WooProductImage } from "@/lib/woocommerce";

interface ProductGalleryProps {
  images: WooProductImage[];
  productName: string;
}

function GallerySlide({
  src,
  alt,
  productName,
  priority,
  sizes,
}: {
  src: string;
  alt: string;
  productName: string;
  priority: boolean;
  sizes: string;
}) {
  const [error, setError] = useState(false);
  if (error) {
    return (
      <div className="relative flex aspect-square w-full flex-col items-center justify-center gap-2 bg-neutral-100 p-6 text-center">
        <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          ZX LINE
        </span>
        <span className="text-sm text-neutral-500">{productName}</span>
      </div>
    );
  }
  return (
    <div className="relative min-w-0 flex-[0_0_100%] aspect-square">
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
        onError={() => setError(true)}
        unoptimized
      />
    </div>
  );
}

function GalleryThumb({
  src,
  selected,
  onClick,
  label,
}: {
  src: string;
  selected: boolean;
  onClick: () => void;
  label: string;
}) {
  const [error, setError] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all sm:h-20 sm:w-20 [&>img]:object-cover"
      style={{
        borderColor: selected ? "var(--brand, #E61151)" : "rgb(229 229 229)",
      }}
      aria-label={label}
    >
      {error ? (
        <div className="flex h-full w-full items-center justify-center bg-neutral-200 text-neutral-400">
          <span className="text-[10px]">?</span>
        </div>
      ) : (
        <Image
          src={src}
          alt=""
          fill
          className="object-cover"
          sizes="80px"
          onError={() => setError(true)}
          unoptimized
        />
      )}
    </button>
  );
}

function ChevronLeft({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
function ChevronRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    loop: true,
    align: "center",
    skipSnaps: false,
    dragFree: false,
  });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const validImages = images.filter(
    (img) => img.src && (img.src.startsWith("http://") || img.src.startsWith("https://"))
  );
  if (validImages.length === 0) {
    return (
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        <div className="flex h-full flex-col items-center justify-center gap-2 p-6 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
            ZX LINE
          </span>
          <span className="text-sm text-neutral-500">{productName}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Contenedor principal: imagen grande + flechas */}
      <div className="relative">
        <div
          className="overflow-hidden rounded-2xl bg-neutral-50/80"
          ref={emblaRef}
          data-lenis-prevent
        >
          <div className="flex touch-pan-x">
            {validImages.map((img, index) => (
              <GallerySlide
                key={`${img.id}-${index}`}
                src={img.src}
                alt={img.alt || productName}
                productName={productName}
                priority={index === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ))}
          </div>
        </div>
        {validImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={scrollPrev}
              className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-900 active:scale-95 sm:left-4"
              aria-label="Imagen anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow-sm transition hover:bg-white hover:text-neutral-900 active:scale-95 sm:right-4"
              aria-label="Siguiente imagen"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Miniaturas: todas las imágenes visibles y clicables */}
      {validImages.length > 1 && (
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
          {validImages.map((img, index) => (
            <GalleryThumb
              key={`${img.id}-${index}`}
              src={img.src}
              selected={index === selectedIndex}
              onClick={() => scrollTo(index)}
              label={`Ver imagen ${index + 1} de ${validImages.length}`}
            />
          ))}
        </div>
      )}

      {/* Dots (alternativa mínima debajo de miniaturas) */}
      {validImages.length > 1 && (
        <p className="text-center text-xs text-neutral-400">
          {selectedIndex + 1} / {validImages.length}
        </p>
      )}
    </div>
  );
}
