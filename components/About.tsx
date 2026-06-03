"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

/** URL de la imagen de fondo (B/N o siluetas). Si está vacía, se usa fondo claro. */
const ABOUT_HERO_IMAGE_URL = "/img/close-up-couple-cuddling-against-white-background-scaled.webp";

interface AboutProps {
  backgroundImageUrl?: string | null;
}

export function About({ backgroundImageUrl }: AboutProps) {
  const hasBgImage = Boolean(ABOUT_HERO_IMAGE_URL?.trim());

  return (
    <motion.section
      className="relative flex min-h-[50vh] items-center overflow-hidden bg-black px-4 py-12 sm:min-h-[70vh] sm:px-6 sm:py-24 lg:px-12 lg:py-32"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Imagen de fondo */}
      {hasBgImage && (
        <>
          <div className="absolute inset-0 z-0">
            <Image
              src={ABOUT_HERO_IMAGE_URL!}
              alt=""
              fill
              className="object-cover object-[70%_center]"
              sizes="100vw"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-r from-black/80 via-black/70 to-black/30" />
        </>
      )}

      {/* Sin imagen: patrón sutil */}
      {!hasBgImage && (
        <>
          {backgroundImageUrl?.startsWith("http") && (
            <div className="absolute inset-0 z-0">
              <Image
                src={backgroundImageUrl}
                alt=""
                fill
                className="object-cover opacity-[0.06]"
                sizes="100vw"
              />
            </div>
          )}
          <div
            className="absolute inset-0 z-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0L60 30L30 60L0 30z' fill='%23000' fill-opacity='1'/%3E%3C/svg%3E")`,
            }}
          />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-6xl">
        <motion.div
          className="max-w-xl lg:max-w-2xl drop-shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <h2
            className="mb-4 text-left text-2xl font-bold leading-tight text-brand sm:mb-8 sm:text-3xl lg:text-4xl xl:text-5xl"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Where Desire
            <br />
            Becomes Reality.
          </h2>

          <p className="mb-8 text-left text-sm leading-relaxed text-white/90 sm:text-base sm:mb-10">
            <strong className="text-white">ZX LINE</strong> is more than just a brand
            of sexual lubricants; it is an invitation to explore intimacy at its
            finest. We believe that &ldquo;Everything starts with desire,&rdquo; and
            our mission is to enhance that desire with luxury products that elevate
            every experience. We offer a sophisticated range designed for men and
            women, guaranteeing quality, safety, and unparalleled pleasure.
          </p>

          <div className="flex items-center gap-4">
            <Link
              href="/zx-line"
              className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition-transform transition-shadow hover:-translate-y-0.5 hover:shadow-lg hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-black active:scale-[0.98] sm:px-8"
            >
              About Us
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
