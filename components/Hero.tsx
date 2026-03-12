"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroProps {
  backgroundImageUrl?: string | null;
  /** URL del video de fondo (mp4, webm, etc.). Si se pasa, tiene prioridad sobre la imagen. */
  videoUrl?: string | null;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

const titleItem = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Hero({ backgroundImageUrl, videoUrl }: HeroProps) {
  const hasVideo = Boolean(videoUrl?.trim());
  const hasLightOverlay =
    !hasVideo && Boolean(backgroundImageUrl?.startsWith("http"));
  const textClasses = hasLightOverlay
    ? {
        label: "text-neutral-500",
        labelAccent: "border-brand",
        title: "text-neutral-900 drop-shadow-none",
        body: "text-neutral-600",
        strong: "text-neutral-900",
      }
    : {
        label: "text-white/80",
        labelAccent: "border-brand",
        title: "text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.5)]",
        body: "text-white/90",
        strong: "text-white",
      };

  return (
    <motion.section
      className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-neutral-900 px-4 py-12 text-center sm:min-h-[85vh] sm:px-6 sm:py-24 lg:min-h-screen lg:px-12"
      initial="hidden"
      animate="visible"
      variants={container}
    >
      {hasVideo ? (
        <>
          <div className="absolute inset-0 z-0">
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster="/img/fondo-hero.jpg"
              className="h-full w-full object-cover"
              aria-hidden
            >
              <source src={videoUrl!} />
            </video>
          </div>
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
        </>
      ) : (
        backgroundImageUrl?.startsWith("http") && (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={backgroundImageUrl}
                alt=""
                fill
                className="object-cover opacity-25"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 z-0 bg-gradient-to-b from-white/85 via-white/75 to-neutral-50" />
          </>
        )
      )}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(230,17,81,0.08),transparent)]" />
      <div className="relative z-10 max-w-3xl">
        <motion.p
          className={`mb-4 text-xs font-medium uppercase tracking-[0.3em] sm:mb-5 sm:text-sm sm:tracking-[0.4em] ${textClasses.label}`}
          variants={item}
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          <span className={`border-b-2 ${textClasses.labelAccent} pb-0.5`}>
            ZX LINE
          </span>
        </motion.p>
        <motion.h1
          className={`mb-6 text-3xl font-bold leading-[1.15] tracking-tight sm:mb-8 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl ${textClasses.title}`}
          variants={titleItem}
          transition={{ duration: 0.5 }}
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          IT ALL STARTS WITH A DESIRE
        </motion.h1>
        <motion.p
          className={`mb-8 text-base leading-relaxed sm:mb-12 sm:text-lg ${textClasses.body} sm:text-xl`}
          variants={item}
        >
          <strong className={textClasses.strong}>ZX LINE</strong> elevates your
          intimacy with luxury lubricants designed for unforgettable experiences.
        </motion.p>
        <motion.div
          className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-4"
          variants={item}
        >
          <Link
            href="/shop"
            className="inline-flex min-h-[44px] min-w-0 flex-1 basis-0 items-center justify-center rounded-full bg-brand px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-white transition-all duration-200 hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] sm:min-h-[48px] sm:min-w-[200px] sm:flex-initial sm:px-8 sm:py-3 sm:text-sm"
          >
            Explore Products
          </Link>
          <Link
            href="/zx-line"
            className="inline-flex min-h-[44px] min-w-0 flex-1 basis-0 items-center justify-center rounded-full border-2 border-brand bg-transparent px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-brand transition-all duration-200 hover:-translate-y-0.5 hover:bg-brand hover:text-white active:scale-[0.98] sm:min-h-[48px] sm:min-w-[200px] sm:flex-initial sm:px-8 sm:py-3 sm:text-sm"
          >
            Discover the ZX line
          </Link>
        </motion.div>
      </div>
    </motion.section>
  );
}
