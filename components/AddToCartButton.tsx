"use client";

import { useCart } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    id: number;
    name: string;
    slug: string;
    price: string;
    imageSrc: string | null;
  };
  quantity?: number;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
}

export function AddToCartButton({
  product,
  quantity = 1,
  className = "",
  children,
  "aria-label": ariaLabel,
}: AddToCartButtonProps) {
  const { addItem } = useCart();

  const handleClick = () => {
    addItem(
      {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        imageSrc: product.imageSrc,
      },
      quantity
    );
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label={ariaLabel ?? (typeof children === "string" ? undefined : "Añadir al carrito")}
    >
      {children ?? "Add to cart"}
    </button>
  );
}
