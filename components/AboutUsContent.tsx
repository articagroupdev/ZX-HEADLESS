"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

/** URL de la imagen de fondo del hero de ZX Line (About us). Déjala vacía para fondo neutro. */
const ZXLINE_HERO_BG_URL = "https://zxline.us/wp-content/uploads/2026/03/3184.jpg";

/** URL de la imagen de la sección "Who We Are" (card derecha). Déjala vacía para ver solo el placeholder. */
const WHO_WE_ARE_IMAGE_URL = "https://zxline.us/wp-content/uploads/2025/07/hand-grasping-sheets-scaled.jpg";

/** URL de la imagen de la sección "Our Mission" (card izquierda). Déjala vacía para ver solo el placeholder. */
const OUR_MISSION_IMAGE_URL = "https://zxline.us/wp-content/uploads/2026/03/2149151753.jpg";

/** URL de la imagen de fondo de la sección "Our Commitment". Déjala vacía para fondo neutro. */
const COMMITMENT_SECTION_BG_URL = "https://zxline.us/wp-content/uploads/2025/07/female-hand-scratching-lovers-back-having-passionate-sex-close-up-scaled.jpg";

/** URL de la imagen de fondo de la sección "Our Promise to You". Mismo estilo que Commitment pero con otro color de overlay. Déjala vacía para fondo neutro. */
const PROMISE_SECTION_BG_URL = "https://zxline.us/wp-content/uploads/2025/07/male-hands-stroking-female-back-passionate-couple-making-love-closeup-scaled.jpg";

const whyChooseItems = [
  {
    title: "Premium Quality",
    description:
      "Every formula and material is carefully tested, using only body-safe, dermatologically approved ingredients.",
    icon: "shield",
  },
  {
    title: "Expert Curation",
    description:
      "We handpick every item in our catalog to ensure it meets our strict standards for pleasure, safety, and style.",
    icon: "curation",
  },
  {
    title: "Customer Care Excellence",
    description:
      "Our friendly, confidential support team is always ready to guide you through product choices or answer your questions.",
    icon: "care",
  },
];

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CurationIcon({ className }: { className?: string }) {
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
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
    </svg>
  );
}

function CareIcon({ className }: { className?: string }) {
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

const iconMap = {
  shield: ShieldIcon,
  curation: CurationIcon,
  care: CareIcon,
};

export function AboutUsContent() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero - fondo configurable con ZXLINE_HERO_BG_URL; mismo contenedor que abajo para alineación visual */}
      <motion.section
        className="relative min-h-[32vh] overflow-hidden border-b border-neutral-100 py-12 sm:py-20 lg:py-24"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {ZXLINE_HERO_BG_URL ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={ZXLINE_HERO_BG_URL}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
              />
            </div>
            <div className="absolute inset-0 z-0 bg-black/40" />
          </>
        ) : (
          <div className="pointer-events-none absolute inset-0 z-0 bg-neutral-50 bg-[radial-gradient(circle_at_top_right,_rgba(230,17,81,0.08),_transparent_50%)]" />
        )}

        <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-8 lg:px-12 min-w-0">
          <div className="max-w-3xl text-left">
          <p
            className={`mb-4 inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] ${
              ZXLINE_HERO_BG_URL
                ? "border-white/40 bg-white/20 text-white"
                : "border-brand/30 bg-brand/5 text-brand"
            }`}
          >
            About ZX LINE SEX
          </p>
          <h1
            className={`text-balance text-2xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl ${
              ZXLINE_HERO_BG_URL ? "text-white" : "text-neutral-900"
            }`}
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Where intimacy meets{" "}
            <span className={ZXLINE_HERO_BG_URL ? "text-white" : "text-brand"}>
              modern luxury
            </span>
            .
          </h1>
          <p
            className={`mt-5 max-w-xl text-sm leading-relaxed sm:text-base ${
              ZXLINE_HERO_BG_URL ? "text-white/90" : "text-neutral-600"
            }`}
          >
            At ZX LINE SEX, we design every detail to feel like a premium
            experience—from the products you choose to the way you discover
            them. Pleasure, privacy, and performance in one seamless journey.
          </p>
          </div>
        </div>
      </motion.section>

      {/* Secciones con layout 2 columnas e imagen - espaciado simétrico, mismo contenedor que hero */}
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-12 sm:space-y-20 sm:px-8 sm:py-20 lg:space-y-28 lg:px-12 lg:py-24 min-w-0">
        {/* Who We Are */}
        <motion.section
          className="grid gap-12 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)] lg:items-start lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="min-w-0">
            <h2
              className="mb-4 text-xl font-bold uppercase tracking-tight text-brand sm:mb-5 sm:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Who We Are
            </h2>
            <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
              At ZX LINE SEX, we believe pleasure is an essential part of life.
              We are an online store dedicated to offering premium sexual
              lubricants and intimate products that inspire confidence, enhance
              connection, and awaken desire—always with discretion and quality at
              the core of everything we do.
            </p>
          </div>

          {/* Imagen Who We Are - cuadrada, borde del diseño (rounded-2xl) */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 shadow-sm">
            {WHO_WE_ARE_IMAGE_URL ? (
              <Image
                src={WHO_WE_ARE_IMAGE_URL}
                alt="Designed for real moments — intimacy, connection and confidence"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Designed for real moments
                </p>
                <p className="max-w-xs text-sm text-neutral-600">
                  Space for brand image: intimacy, connection and confidence.
                </p>
              </div>
            )}
          </div>
        </motion.section>

        {/* Our Mission */}
        <motion.section
          className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] lg:items-start lg:gap-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.05 }}
        >
          {/* Imagen Our Mission - cuadrada, borde del diseño (rounded-2xl) */}
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-neutral-200 bg-brand/5 shadow-sm">
            {OUR_MISSION_IMAGE_URL ? (
              <Image
                src={OUR_MISSION_IMAGE_URL}
                alt="Mission snapshot — product photos or textures aligned with sensual wellness"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col justify-between p-5">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
                  Mission snapshot
                </p>
                <p className="max-w-xs text-sm text-neutral-600">
                  Space for product photos or textures aligned with sensual wellness.
                </p>
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2
              className="mb-4 text-xl font-bold uppercase tracking-tight text-brand sm:mb-5 sm:text-2xl lg:text-3xl"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Our Mission
            </h2>
            <p className="text-base leading-relaxed text-neutral-700 sm:text-lg">
              To empower people to explore their sensuality with safe,
              high-quality products that enhance intimacy. We aim to break
              taboos, promote sexual wellness, and deliver a shopping experience
              that is both comfortable and exciting.
            </p>
          </div>
        </motion.section>

        {/* Our Commitment - fondo con URL; borde rounded-2xl del diseño */}
        <motion.section
          className="relative min-h-[320px] overflow-hidden rounded-2xl border border-neutral-200 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08 }}
        >
          {COMMITMENT_SECTION_BG_URL ? (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={COMMITMENT_SECTION_BG_URL}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 z-0 bg-brand/60" />
            </>
          ) : (
            <div className="absolute inset-0 z-0 bg-neutral-100" />
          )}

          <div className="relative z-10 mx-auto max-w-3xl">
            <h2
              className={`mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${
                COMMITMENT_SECTION_BG_URL ? "text-white" : "text-brand"
              }`}
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Our Commitment to You
            </h2>
            <p
              className={`text-base leading-relaxed sm:text-lg ${
                COMMITMENT_SECTION_BG_URL ? "text-white/95" : "text-neutral-700"
              }`}
            >
              We are committed to making your experience with ZX LINE SEX
              seamless, private, and satisfying. Every product we offer is tested
              for quality and packaged with care, ensuring you can focus on what
              truly matters—your pleasure.
            </p>
          </div>
        </motion.section>
      </div>

      {/* Why Choose Us - tarjetas sólidas, espaciado simétrico */}
      <motion.section
        className="border-y border-neutral-100 bg-neutral-50 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center lg:mb-16">
            <h2
              className="mb-3 text-2xl font-semibold tracking-tight text-brand sm:text-3xl lg:text-4xl"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Why Choose Us
            </h2>
            <p className="text-base leading-relaxed text-neutral-600 sm:text-lg">
              We understand that choosing intimate products is personal. That’s
              why we focus on three key values:
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 sm:gap-8">
            {whyChooseItems.map((r) => {
              const IconComponent = iconMap[r.icon as keyof typeof iconMap];
              return (
                <article
                  key={r.title}
                  className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-brand/30 hover:shadow-md sm:p-6 lg:p-7"
                >
                  <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-brand text-white">
                    {IconComponent && (
                      <IconComponent className="h-5 w-5 shrink-0" />
                    )}
                  </div>
                  <h3
                    className="mb-3 text-base font-semibold tracking-tight text-neutral-900 sm:text-lg"
                    style={{
                      fontFamily: "var(--font-goldman), sans-serif",
                    }}
                  >
                    {r.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {r.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Our Promise to You - mismo contenedor max-w-6xl para respetar la línea visual */}
      <div className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24">
        <motion.section
          className="relative min-h-[320px] overflow-hidden rounded-2xl border border-neutral-200 px-6 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24 shadow-sm"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
        >
          {PROMISE_SECTION_BG_URL ? (
            <>
              <div className="absolute inset-0 z-0">
                <Image
                  src={PROMISE_SECTION_BG_URL}
                  alt=""
                  fill
                  className="object-cover object-center"
                  sizes="100vw"
                />
              </div>
              <div className="absolute inset-0 z-0 bg-slate-800/60" />
            </>
          ) : (
            <div className="absolute inset-0 z-0 bg-neutral-200" />
          )}

          <div className="relative z-10 mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-start">
              <div className="min-w-0">
                <h2
                  className={`mb-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl ${
                    PROMISE_SECTION_BG_URL ? "text-white" : "text-brand"
                  }`}
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  Our Promise to You
                </h2>
                <p
                  className={`text-base leading-relaxed sm:text-lg ${
                    PROMISE_SECTION_BG_URL ? "text-white/95" : "text-neutral-700"
                  }`}
                >
                We promise more than just products—we promise an experience. Every
                step, from browsing our website to unboxing your order, is
                designed to feel safe, exciting, and rewarding. We understand that
                intimacy is personal, and we treat your trust with the utmost care.
                With ZX LINE SEX, you’re not just buying lubricants—you’re
                investing in moments that bring you closer to yourself or your
                partner.
                </p>
              </div>

              <div className="space-y-4">
                <p
                  className={`text-sm ${
                    PROMISE_SECTION_BG_URL ? "text-white/90" : "text-neutral-600"
                  }`}
                >
                  Ready to explore more? Discover formulations crafted to elevate
                  every touch, every sensation, every encounter.
                </p>
                <Link
                  href="/shop"
                  className={`inline-flex min-h-[48px] items-center justify-center rounded-xl px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ${
                    PROMISE_SECTION_BG_URL
                      ? "bg-white text-slate-800 hover:bg-white/95 focus-visible:ring-white focus-visible:ring-offset-slate-900"
                      : "bg-brand text-white hover:brightness-110 focus-visible:ring-brand focus-visible:ring-offset-white"
                  }`}
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
