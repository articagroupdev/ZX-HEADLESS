import type { Metadata } from "next";
import Link from "next/link";
import { AboutUsContent } from "@/components/AboutUsContent";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "At ZX LINE SEX we believe pleasure is essential. Premium lubricants and intimate products with discretion and quality. Our mission, commitment, and promise to you.",
};

export default function ZxLinePage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <AboutUsContent />
    </div>
  );
}
