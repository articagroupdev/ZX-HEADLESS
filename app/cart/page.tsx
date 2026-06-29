import { CartContents } from "@/components/CartContents";

export const metadata = {
  title: "Shopping Cart",
  description: "Review your selected ZX LINE products before checkout.",
  robots: { index: false, follow: false },
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <CartContents />
    </div>
  );
}
