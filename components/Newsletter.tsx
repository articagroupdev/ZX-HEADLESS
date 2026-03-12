"use client";

import { motion } from "framer-motion";

export function Newsletter() {
  return (
    <motion.section
      className="border-t border-neutral-200 bg-neutral-100/80 px-4 py-12 sm:px-6 sm:py-20 lg:py-24"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
    >
      <div className="mx-auto max-w-xl text-center">
        <motion.h2
          className="mb-3 text-2xl font-bold tracking-tight text-neutral-900 sm:mb-4 sm:text-3xl lg:text-4xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          Be the First to Feel It
        </motion.h2>
        <motion.p
          className="mb-10 text-base leading-relaxed text-neutral-600 sm:text-lg"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.05 }}
        >
          Sign up to receive exclusive updates when new products arrive — plus
          special offers and sensual tips straight to your inbox.
        </motion.p>
        <motion.form
          action="#"
          method="post"
          className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-center sm:gap-0"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          <input
            type="email"
            name="email"
            placeholder="Your email"
            required
            aria-label="Email"
            className="min-h-[48px] min-w-0 flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3.5 text-base text-neutral-900 shadow-sm placeholder:text-neutral-400 transition focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20 sm:rounded-r-none sm:rounded-l-xl"
          />
          <button
            type="submit"
            className="min-h-[48px] rounded-xl bg-brand px-6 py-3.5 text-sm font-semibold uppercase tracking-wider text-white shadow-md transition hover:bg-brand-hover hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 focus:ring-offset-neutral-100 active:scale-[0.98] sm:rounded-l-none sm:rounded-r-xl sm:px-8"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Subscribe Now
          </button>
        </motion.form>
      </div>
    </motion.section>
  );
}
