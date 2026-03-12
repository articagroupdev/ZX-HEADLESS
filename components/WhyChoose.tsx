"use client";

import { motion } from "framer-motion";

const reasons = [
  {
    title: "Premium Quality & Safety",
    description:
      "All our products are crafted using high-quality ingredients and manufactured under strict quality controls in the USA. Safe, hypoallergenic, and skin-friendly formulations for all body types.",
    icon: "shield",
  },
  {
    title: "Wide Variety for Every Desire",
    description:
      "From flavored lubricants to retardant sprays and revitalizing gels. Options tailored for every preference and occasion.",
    icon: "variety",
  },
  {
    title: "Compatibility & Convenience",
    description:
      "Water-based, compatible with condoms and most sex toys. Easy to apply, fast-absorbing, and non-sticky for a smooth experience.",
    icon: "drop",
  },
  {
    title: "Enhanced Pleasure & Comfort",
    description:
      "Heightened sensitivity, reduced friction, and prolonged intimacy. Formulations designed to maximize comfort and pleasure.",
    icon: "heart",
  },
  {
    title: "Discreet & Elegant Packaging",
    description:
      "Sleek, modern packaging that balances sophistication and subtlety. Perfect for discreet storage or gifting.",
    icon: "gift",
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

function VarietyIcon({ className }: { className?: string }) {
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
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function DropIcon({ className }: { className?: string }) {
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
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

function HeartIcon({ className }: { className?: string }) {
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

function GiftIcon({ className }: { className?: string }) {
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
      <polyline points="20 12 20 22 4 22 4 12" />
      <rect x="2" y="7" width="20" height="5" />
      <line x1="12" y1="22" x2="12" y2="7" />
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
    </svg>
  );
}

const iconMap = {
  shield: ShieldIcon,
  variety: VarietyIcon,
  drop: DropIcon,
  heart: HeartIcon,
  gift: GiftIcon,
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0 },
};

export function WhyChoose() {
  return (
    <motion.section
      className="border-t border-neutral-200 bg-neutral-50/50 px-4 py-10 sm:px-6 sm:py-20 lg:px-12"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={container}
    >
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <motion.h2
            className="mb-3 text-2xl font-semibold tracking-tight text-brand sm:mb-4 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            variants={item}
          >
            Why Choose ZX LINE Products?
          </motion.h2>
          <motion.p
            className="mb-10 text-base leading-relaxed text-neutral-600 sm:mb-12 sm:text-lg"
            variants={item}
          >
            At ZX LINE, we believe intimacy should be comfortable, exciting, and
            tailored to your needs. Our premium range is designed with your
            pleasure and confidence in mind.
          </motion.p>
        </div>

        <motion.div
          className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:gap-8"
          variants={container}
        >
          {reasons.map((r) => {
            const IconComponent = iconMap[r.icon as keyof typeof iconMap];
            return (
              <motion.article
                key={r.title}
                className="group flex flex-col rounded-2xl border border-brand/20 bg-brand/5 p-5 transition-all duration-200 hover:border-brand/40 hover:bg-brand/10 hover:shadow-lg hover:shadow-brand/10 sm:p-7"
                variants={item}
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-brand/30 bg-brand text-white shadow-sm">
                  {IconComponent && (
                    <IconComponent className="h-6 w-6 shrink-0" />
                  )}
                </div>
                <h3
                  className="mb-2 text-base font-semibold tracking-tight text-neutral-900 sm:text-lg"
                  style={{ fontFamily: "var(--font-goldman), sans-serif" }}
                >
                  {r.title}
                </h3>
                <p className="text-sm leading-relaxed text-neutral-600">
                  {r.description}
                </p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </motion.section>
  );
}
