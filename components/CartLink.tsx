"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export function CartLink() {
  const { totalItems } = useCart();
  return (
    <Link
      href="/cart"
      className="text-sm font-medium uppercase tracking-wider text-brand transition hover:opacity-90"
    >
      CART{totalItems > 0 ? ` (${totalItems})` : ""}
    </Link>
  );
}
