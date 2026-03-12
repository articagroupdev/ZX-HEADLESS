import { CheckoutContent } from "@/components/CheckoutContent";

export const metadata = {
  title: "Checkout | ZX LINE",
  description: "Complete your order. Premium intimate wellness.",
};

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] text-neutral-900">
      <CheckoutContent />
    </div>
  );
}
