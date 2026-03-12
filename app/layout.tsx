import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Goldman } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { LenisProvider } from "@/components/LenisProvider";
import { Header } from "@/components/Header";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const goldman = Goldman({
  variable: "--font-goldman",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://zxline.us"),
  title: {
    default: "ZX LINE | Premium Intimate Wellness",
    template: "%s | ZX LINE",
  },
  description:
    "ZX LINE elevates your intimacy with luxury lubricants and intimate wellness essentials, crafted for unforgettable, safe and discreet experiences.",
  icons: {
    icon: "/img/zx-icon.ico",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "ZX LINE",
    title: "ZX LINE | Premium Intimate Wellness",
    description:
      "Discover ZX LINE lubricants and intimate wellness products with premium quality, safety and discreet worldwide shipping.",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZX LINE | Premium Intimate Wellness",
    description:
      "Luxury lubricants and intimate wellness essentials with discreet shipping.",
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={goldman.variable} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen overflow-x-hidden bg-white font-sans text-neutral-900 antialiased`}
        suppressHydrationWarning
      >
        <CartProvider>
          <FavoritesProvider>
            <LenisProvider>
              <Header />
              <main className="min-w-0">{children}</main>
              <CartDrawer />
              <WhatsAppButton />
              <Footer />
            </LenisProvider>
          </FavoritesProvider>
        </CartProvider>
      </body>
    </html>
  );
}
