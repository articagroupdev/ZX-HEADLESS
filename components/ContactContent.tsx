"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

/** Misma imagen de fondo que el hero de Shop */
const HERO_IMAGE_URL = "/img/contact-hero.webp";

/** URL de la imagen de fondo de la sección CTA (card). Overlay oscuro, no rosa. Vacío = fondo neutro. */
const CTA_SECTION_BG_URL = "/img/side-view-couple-s-hands-posing-scaled.webp";

const CONTACT_PHONE = "+58 414-7931224";
const CONTACT_EMAIL = "info@zxline.us";
const INSTAGRAM_URL = "https://www.instagram.com/zxline.us";
const TIKTOK_URL = "https://www.tiktok.com/@zxline.us";

const valueCards = [
  {
    title: "Secure Payments",
    description:
      "Shop with confidence knowing that your transactions are safeguarded.",
    icon: "shield",
  },
  {
    title: "Free Shipping",
    description:
      "Shopping with no extra charges – savor the liberty of complimentary shipping on every order.",
    icon: "truck",
  },
  {
    title: "Order Tracking",
    description:
      "Stay in the loop with our Order Tracking feature – from checkout to your doorstep.",
    icon: "tracking",
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

function TruckIcon({ className }: { className?: string }) {
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
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function TrackingIcon({ className }: { className?: string }) {
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
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
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
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
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
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
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
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
    </svg>
  );
}

const iconMap = {
  shield: ShieldIcon,
  truck: TruckIcon,
  tracking: TrackingIcon,
};

export function ContactContent() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get("name") as string)?.trim();
    const email = (formData.get("email") as string)?.trim();
    const message = (formData.get("message") as string)?.trim();

    if (!name || !email || !message) {
      setStatus("error");
      return;
    }

    try {
      // Placeholder: enviar a API cuando exista. Por ahora simulamos éxito.
      await new Promise((r) => setTimeout(r, 800));
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Hero: mismo fondo que Shop */}
      <motion.section
        className="relative flex min-h-[28vh] items-center justify-center overflow-hidden px-4 py-10 sm:min-h-[40vh] sm:px-6 sm:py-20 lg:min-h-[45vh] lg:py-28"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {HERO_IMAGE_URL ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={HERO_IMAGE_URL}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 z-0 bg-black/50" />
            <div className="relative z-10 text-center">
              <h1
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Contact Us
              </h1>
              <p className="mt-2 text-base text-white/90 sm:mt-3 sm:text-lg">Get in touch</p>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 z-0 bg-neutral-200" />
            <div className="relative z-10 text-center">
              <h1
                className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Contact Us
              </h1>
              <p className="mt-2 text-base text-neutral-600 sm:mt-3 sm:text-lg">Get in touch</p>
            </div>
          </>
        )}
      </motion.section>

      {/* Sección contacto: misma línea visual que Value cards (rounded-2xl, border, shadow-sm) */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-20 min-w-0">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="contact-section-wrapper overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition-all duration-200 hover:border-brand/30 hover:shadow-md"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="contact-section-inner flex flex-col md:flex-row">
              {/* Columna izquierda: label + título + descripción + datos de contacto */}
              <div className="contact-info-col flex flex-1 flex-col justify-center border-b border-neutral-100 bg-neutral-50/50 p-6 sm:p-8 md:min-w-0 md:border-b-0 md:border-r">
                <p
                  className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-400"
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  We&apos;re here to help you
                </p>
                <h2
                  className="mt-3 text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl lg:text-[1.75rem]"
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  Discuss your needs with us
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-neutral-600">
                  We value the connection with our community and are here to assist in any way we can. Reach out through the channels below.
                </p>
                <div className="mt-8 space-y-5">
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="flex min-h-[44px] items-center gap-4 text-neutral-700 transition hover:text-brand"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <MailIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-wider text-neutral-400">E-mail</span>
                      <span className="text-neutral-900">{CONTACT_EMAIL}</span>
                    </div>
                  </a>
                  <a
                    href="tel:+584147931224"
                    className="flex min-h-[44px] items-center gap-4 text-neutral-700 transition hover:text-brand"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand/10 text-brand">
                      <PhoneIcon className="h-5 w-5" />
                    </span>
                    <div>
                      <span className="block text-xs font-medium uppercase tracking-wider text-neutral-400">Phone number</span>
                      <span className="text-neutral-900">{CONTACT_PHONE}</span>
                    </div>
                  </a>
                </div>
                {/* Follow us: debajo del teléfono */}
                <div className="mt-8 pt-6 border-t border-neutral-200">
                  <h3
                    className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500"
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    Follow us
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <a
                      href={INSTAGRAM_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-700 transition hover:border-brand hover:text-brand"
                      aria-label="Instagram"
                    >
                      <InstagramIcon className="h-5 w-5 text-brand" />
                      <span className="text-sm font-medium">Instagram</span>
                    </a>
                    <a
                      href={TIKTOK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-h-[44px] items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-neutral-700 transition hover:border-brand hover:text-brand"
                      aria-label="TikTok"
                    >
                      <TikTokIcon className="h-5 w-5 text-brand" />
                      <span className="text-sm font-medium">TikTok</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Columna derecha: formulario */}
              <div className="contact-form-col min-w-0 flex-1 p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="mb-1 block text-sm font-medium text-neutral-700">
                      Name
                    </label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      className="min-h-[44px] w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-base text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="mb-1 block text-sm font-medium text-neutral-700">
                      Email
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      className="min-h-[44px] w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-base text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="mb-1 block text-sm font-medium text-neutral-700">
                      Phone
                    </label>
                    <input
                      id="contact-phone"
                      name="phone"
                      type="tel"
                      className="min-h-[44px] w-full rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-base text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="mb-1 block text-sm font-medium text-neutral-700">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      required
                      rows={3}
                      className="min-h-[100px] w-full resize-y rounded-lg border border-neutral-200 bg-neutral-50/80 px-3 py-2.5 text-base text-neutral-900 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  {status === "success" && (
                    <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                      Thank you. Your message has been sent.
                    </p>
                  )}
                  {status === "error" && (
                    <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      Please fill in all required fields and try again.
                    </p>
                  )}
                  <button
                    type="submit"
                    disabled={status === "sending"}
                    className="flex min-h-[48px] items-center justify-center rounded-lg bg-brand px-6 py-3 text-sm font-semibold uppercase tracking-wider text-white shadow-sm transition-all hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-70 active:scale-[0.98]"
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    {status === "sending" ? "Sending…" : "Send message"}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value cards */}
      <motion.section
        className="border-y border-neutral-100 bg-neutral-50/50 px-4 py-12 sm:px-6 sm:py-14 lg:px-12 lg:py-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 },
          },
        }}
      >
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {valueCards.map((card) => {
              const Icon = iconMap[card.icon as keyof typeof iconMap];
              return (
                <motion.article
                  key={card.title}
                  className="flex flex-col rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-brand/30 hover:shadow-md sm:p-6 lg:p-8"
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0 },
                  }}
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
                    {Icon && <Icon className="h-6 w-6 shrink-0" />}
                  </div>
                  <h3
                    className="mb-2 text-lg font-semibold tracking-tight text-neutral-900"
                    style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-neutral-600">
                    {card.description}
                  </p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* CTA: misma línea visual (rounded-2xl, border-neutral-200, shadow-sm) */}
      <section className="border-y border-neutral-100 bg-neutral-50/50 px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-20 min-w-0">
        <div className="mx-auto max-w-6xl">
          <motion.div
            className="relative min-h-[280px] overflow-hidden rounded-2xl border border-neutral-200 px-6 py-14 shadow-sm transition-all duration-200 hover:border-brand/30 hover:shadow-md sm:min-h-[320px] sm:px-8 sm:py-16 lg:px-12 lg:py-20"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5 }}
          >
            {CTA_SECTION_BG_URL ? (
              <>
                <div className="absolute inset-0 z-0">
                  <Image
                    src={CTA_SECTION_BG_URL}
                    alt=""
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                  />
                </div>
                <div className="absolute inset-0 z-0 bg-slate-800/60" />
              </>
            ) : (
              <div className="absolute inset-0 z-0 bg-neutral-100" />
            )}

            <div className="relative z-10 mx-auto max-w-2xl text-center">
              <h2
                className={`mb-4 text-xl font-bold tracking-tight sm:text-2xl lg:text-3xl ${
                  CTA_SECTION_BG_URL ? "text-white" : "text-neutral-900"
                }`}
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Ready to take your pleasure to the next level?
              </h2>
              <p
                className={`mb-6 text-sm leading-relaxed sm:mb-8 sm:text-base ${
                  CTA_SECTION_BG_URL ? "text-white/90" : "text-neutral-600"
                }`}
              >
                Get in touch and explore our full collection of lubricants and
                accessories designed to intensify every moment.
              </p>
              <Link
                href="/shop"
                className={`inline-flex min-h-[52px] items-center justify-center rounded-xl px-8 py-4 text-base font-semibold uppercase tracking-wider shadow-md transition-all hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] ${
                  CTA_SECTION_BG_URL
                    ? "bg-white text-slate-800 hover:bg-white/95 focus-visible:ring-white focus-visible:ring-offset-slate-900"
                    : "bg-brand text-white hover:brightness-110 focus-visible:ring-brand focus-visible:ring-offset-2"
                }`}
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Shop Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
