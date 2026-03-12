import { CartContents } from "@/components/CartContents";

export const metadata = {
  title: "Shopping Cart | ZX LINE",
  description: "Your cart. Premium intimate wellness.",
};

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <CartContents />
    </div>
  );
}
