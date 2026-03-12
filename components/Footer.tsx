import Link from "next/link";
import Image from "next/image";

const LOGO_URL =
  "https://zxline.us/wp-content/uploads/2026/03/cropped-zx-512x512-1-e1772724043352-removebg-preview.png";

const shopLinks = [
  { label: "My account", href: "/account" },
  { label: "Products", href: "/shop" },
  { label: "Cart", href: "/cart" },
];

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "ZX Line", href: "/zx-line" },
  { label: "Contact", href: "/contact" },
];

const CONTACT_EMAIL = "info@zxline.us";
const CONTACT_PHONE = "(303) 555-0105";
const CONTACT_PHONE_TEL = "+13035550105";

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
      aria-hidden
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
      aria-hidden
    >
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
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
      aria-hidden
    >
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="bg-brand text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-14">
        <div className="grid gap-8 sm:grid-cols-2 sm:gap-10 lg:grid-cols-4 min-w-0">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image
                src={LOGO_URL}
                alt="ZX LINE"
                width={150}
                height={150}
                className="h-12 w-auto object-contain brightness-0 invert lg:h-14"
              />
            </Link>
            <p className="max-w-[260px] text-sm leading-relaxed text-white/90 min-w-0">
              Your trusted destination for premium lubricants and intimate
              wellness.
            </p>
          </div>

          {/* Shop */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Shop
            </p>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition hover:text-white hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Links
            </p>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/90 transition hover:text-white hover:underline underline-offset-2"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p
              className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-white/80"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Contact
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-sm text-white/90 transition hover:text-white hover:underline underline-offset-2"
            >
              <MailIcon className="h-4 w-4 shrink-0 opacity-80" />
              {CONTACT_EMAIL}
            </a>
            <a
              href={`tel:${CONTACT_PHONE_TEL}`}
              className="mt-2 inline-block text-sm text-white/80 transition hover:text-white hover:underline underline-offset-2"
            >
              {CONTACT_PHONE}
            </a>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.instagram.com/zxline.us"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 hover:text-white"
                aria-label="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a
                href="https://www.tiktok.com/@zxline.us"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25 hover:text-white"
                aria-label="TikTok"
              >
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright bar */}
      <div className="border-t border-white/20 bg-brand-hover">
        <div className="mx-auto max-w-6xl px-4 py-3 sm:px-6 sm:py-4 lg:px-12 min-w-0">
          <p className="text-center text-xs text-white/80">
            © {new Date().getFullYear()} ZX LINE. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
