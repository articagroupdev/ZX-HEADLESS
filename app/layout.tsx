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
  title: { default: "ZX Line", template: "ZX Line | %s" },
  description:
    "Zx Line elevates your intimacy with luxury lubricants designed for unforgettable experiences. Premium quality, safety, and pleasure.",
  icons: { icon: "/img/zx-icon.ico" },
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
