"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/**
 * URL de fondo de esta sección (ej. tubos Arousal Gel, textura de producto).
 * La imagen cubre todo el espacio de la sección sin bordes visibles.
 * Pega aquí la URL o pásala por la prop backgroundImageUrl desde la página.
 */
const PROMO_SECTION_BACKGROUND_URL = "/img/man-woman-holding-hands-while-bed-scaled.webp";
/**
 * URL de la imagen del bloque rosa (icono + "POTENCIADOR VIGORIZANTE").
 * La imagen ocupa todo el espacio del bloque sin bordes visibles.
 */
const PROMO_CARD_IMAGE_URL = "https://zxline.us/wp-content/uploads/2025/07/potenciador-vigorizante.png";

interface PromoBannerProps {
  /** URL de fondo de esta sección. Sobrescribe PROMO_SECTION_BACKGROUND_URL. */
  backgroundImageUrl?: string | null;
  /** Sobrescribe la imagen del bloque rosa. */
  promoCardImageUrl?: string | null;
}

export function PromoBanner({
  backgroundImageUrl,
  promoCardImageUrl,
}: PromoBannerProps) {
  const bgUrl = backgroundImageUrl ?? PROMO_SECTION_BACKGROUND_URL;
  const cardUrl = promoCardImageUrl ?? PROMO_CARD_IMAGE_URL;
  const hasBg = Boolean(bgUrl?.trim());
  const hasCard = Boolean(cardUrl?.trim());

  return (
    <motion.section
      className="relative min-h-[36vh] overflow-hidden px-4 py-10 sm:min-h-[50vh] sm:px-6 sm:py-20 lg:px-12 lg:py-28"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
    >
      {/* Imagen de fondo de la sección (ocupa todo el espacio, sin bordes) */}
      {hasBg && (
        <>
          <div className="absolute inset-0 z-0 min-w-full min-h-full">
            <Image
              src={bgUrl!}
              alt=""
              fill
              className="object-cover object-center min-w-full min-h-full blur-[2px]"
              sizes="100vw"
              priority={false}
            />
          </div>
          <div className="absolute inset-0 z-0 bg-neutral-900/50" />
        </>
      )}
      {!hasBg && (
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-neutral-800 to-neutral-900" />
      )}

      {/* Contenido: bloque rosa (imagen) + texto */}
      <div className="relative z-10 mx-auto flex min-h-[28vh] max-w-6xl flex-col items-center justify-center gap-6 sm:min-h-[40vh] sm:gap-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16">
        {/* Bloque rosa: imagen desde URL */}
        {hasCard && (
          <motion.div
            className="relative h-36 w-36 flex-shrink-0 overflow-hidden bg-brand sm:h-56 sm:w-56 lg:h-72 lg:w-72"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src={cardUrl}
              alt="Potenciador vigorizante"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 224px, 288px"
            />
          </motion.div>
        )}

        {/* Texto superpuesto */}
        <motion.p
          className="max-w-xl px-2 text-left text-base font-medium italic leading-snug text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.6)] sm:text-xl sm:px-0 lg:text-2xl xl:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Innovative formulas that intensify sensations and prolong enjoyment.
        </motion.p>
      </div>
    </motion.section>
  );
}
