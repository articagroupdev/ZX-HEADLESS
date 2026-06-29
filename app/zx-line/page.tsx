import type { Metadata } from "next";
import { AboutUsContent } from "@/components/AboutUsContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "At ZX LINE we believe pleasure is essential. Premium lubricants and intimate wellness products crafted with discretion and quality. Our mission, commitment, and promise to you.",
  alternates: {
    canonical: "/zx-line",
  },
  openGraph: {
    title: "About Us | ZX LINE",
    description:
      "At ZX LINE we believe pleasure is essential. Premium lubricants and intimate wellness products crafted with discretion and quality.",
    url: "/zx-line",
  },
};

export default function ZxLinePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <AboutUsContent />
    </div>
  );
}
