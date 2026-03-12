import type { Metadata } from "next";
import Link from "next/link";
import { ContactContent } from "@/components/ContactContent";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with ZX LINE. We value the connection with our community. Contact us by form, phone, or email. Secure payments, free shipping, order tracking.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <ContactContent />
    </div>
  );
}
