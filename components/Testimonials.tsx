"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

/** Wall of Love: reseñas cortas tipo redes sociales (handle + cita breve) */
const wallItems = [
  {
    quote: "Quality is top-notch. The experience was unforgettable.",
    handle: "@daniel_m",
    location: "Los Angeles, CA",
    platform: "instagram" as const,
  },
  {
    quote: "Nothing compares to ZX LINE. Texture is perfect, feels so natural.",
    handle: "@emily.r",
    location: "Miami, FL",
    platform: "google" as const,
  },
  {
    quote: "The website is classy, shipping was fast. Nights are a lot more exciting now.",
    handle: "@sophia_l",
    location: "New York, NY",
    platform: "instagram" as const,
  },
  {
    quote: "Body-safe and feels amazing. Already recommended to friends.",
    handle: "@marcusw",
    location: "Chicago, IL",
    platform: "google" as const,
  },
  {
    quote: "Discreet packaging — I can order anytime without worrying.",
    handle: "@alex_t",
    location: "Houston, TX",
    platform: "instagram" as const,
  },
  {
    quote: "Customer service answered without making it awkward. 10/10.",
    handle: "@jordan_k",
    location: "Phoenix, AZ",
    platform: "google" as const,
  },
  {
    quote: "First time trying something like this. So glad I did.",
    handle: "@sam_c",
    location: "Denver, CO",
    platform: "instagram" as const,
  },
  {
    quote: "Fast delivery, premium quality. Will order again.",
    handle: "@chris_v",
    location: "Seattle, WA",
    platform: "google" as const,
  },
];

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.04, delayChildren: 0.1 },
  },
};

const card = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1 },
};

function HeartIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  );
}

function InstagramBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 px-2 py-0.5 text-[10px] font-medium text-white ${className ?? ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
      Instagram
    </span>
  );
}

function GoogleBadge({ className }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] font-medium text-white ${className ?? ""}`}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
      </svg>
      Google
    </span>
  );
}

function ReviewCard({
  item,
  variants,
}: {
  item: (typeof wallItems)[0];
  variants: typeof card;
}) {
  return (
    <motion.article
      className="group flex h-full flex-col rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-sm transition-all duration-200 hover:border-brand/25 hover:shadow-md sm:p-5 min-w-0"
      variants={variants}
    >
      <div className="mb-3 flex items-start justify-between gap-2">
        {item.platform === "instagram" ? (
          <InstagramBadge />
        ) : (
          <GoogleBadge />
        )}
        <HeartIcon className="h-4 w-4 flex-shrink-0 text-brand/40 group-hover:text-brand/70" />
      </div>
      <blockquote className="flex-1">
        <p className="text-sm leading-relaxed text-neutral-700">
          &ldquo;{item.quote}&rdquo;
        </p>
      </blockquote>
      <footer className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
        <span className="text-xs font-semibold text-neutral-900">
          {item.handle}
        </span>
        <span className="text-[11px] text-neutral-400">
          {item.location}
        </span>
      </footer>
    </motion.article>
  );
}

function PrevIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function NextIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6" />
    </svg>
  );
}

export function Testimonials() {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: "x",
    loop: true,
    align: "start",
    skipSnaps: false,
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

  return (
    <motion.section
      className="border-t border-neutral-200 bg-neutral-100/60 px-4 py-10 sm:px-6 sm:py-20 lg:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={container}
      aria-labelledby="wall-heading"
    >
      <div className="mx-auto max-w-6xl">
        <header className="mb-6 text-center sm:mb-10 lg:mb-14">
          <motion.div
            className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-brand/10 px-3 py-1 text-brand"
            variants={card}
          >
            <HeartIcon className="h-4 w-4" />
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Wall of Love
            </span>
          </motion.div>
          <motion.h2
            id="wall-heading"
            className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            variants={card}
          >
            What they say on social media
          </motion.h2>
          <motion.p
            className="mt-2 text-neutral-600 sm:text-lg"
            variants={card}
          >
            Real reviews from our community
          </motion.p>
        </header>

        {/* Móvil: carrusel horizontal */}
        <div className="sm:hidden">
          <div
            className="overflow-hidden py-2"
            ref={emblaRef}
            data-lenis-prevent
          >
            <div className="flex touch-pan-x gap-3">
            {wallItems.map((item) => (
              <div
                key={item.handle}
                className="min-w-0 flex-[0_0_85%] sm:flex-[0_0_48%]"
              >
                <ReviewCard item={item} variants={card} />
              </div>
            ))}
            </div>
          </div>
          {wallItems.length > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => emblaApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-neutral-200 text-neutral-600 transition hover:border-brand hover:bg-brand/5 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
                aria-label="Anterior"
              >
                <PrevIcon className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => emblaApi?.scrollNext()}
                disabled={!canScrollNext}
                className="flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full border-2 border-neutral-200 text-neutral-600 transition hover:border-brand hover:bg-brand/5 hover:text-brand disabled:pointer-events-none disabled:opacity-40"
                aria-label="Siguiente"
              >
                <NextIcon className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: grid */}
        <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {wallItems.map((item) => (
            <ReviewCard key={item.handle} item={item} variants={card} />
          ))}
        </div>
      </div>
    </motion.section>
  );
}
