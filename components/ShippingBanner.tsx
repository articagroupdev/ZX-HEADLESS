import Link from "next/link";

export function ShippingBanner() {
  return (
    <div className="border-t border-neutral-200 bg-neutral-100 px-4 py-3 text-center text-sm text-neutral-700 sm:px-6 sm:py-4 lg:px-12">
      <p className="mx-auto max-w-6xl leading-relaxed">
        <strong>Free shipping on orders over $300</strong>. A minimum purchase of
        $40 is required to checkout. Taxes and shipping for smaller orders are
        calculated at the end.{" "}
        <Link href="/#products" className="font-semibold text-brand underline underline-offset-2 hover:opacity-90">
          Shop Now
        </Link>
      </p>
    </div>
  );
}
