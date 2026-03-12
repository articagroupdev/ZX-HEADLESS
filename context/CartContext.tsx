"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/cart-types";
import type { StoreCartTotals, SimpleShippingRate } from "@/lib/store-api-types";

interface CartApiResponse {
  items: CartItem[];
  items_count?: number;
  totals?: StoreCartTotals | null;
  shipping?: SimpleShippingRate | null;
}

interface CartContextValue {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity" | "key">, quantity?: number) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  totalItems: number;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isLoading: boolean;
  error: string | null;
  totals: StoreCartTotals | null;
  shipping: SimpleShippingRate | null;
}

const CartContext = createContext<CartContextValue | null>(null);

async function fetchCart(): Promise<CartApiResponse> {
  const res = await fetch("/api/store/cart", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch cart");
  const data = await res.json();
  return {
    items: Array.isArray(data.items) ? data.items : [],
    items_count: data.items_count ?? 0,
    totals: data.totals ?? null,
    shipping: data.shipping ?? null,
  };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState<StoreCartTotals | null>(null);
  const [shipping, setShipping] = useState<SimpleShippingRate | null>(null);

  const refreshCart = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchCart();
      setItems(data.items);
      setTotals(data.totals ?? null);
      setShipping(data.shipping ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error loading cart");
      setItems([]);
      setTotals(null);
      setShipping(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const addItem = useCallback(
    async (item: Omit<CartItem, "quantity" | "key">, quantity = 1) => {
      setError(null);
      const optimisticKey = `opt-${item.id}-${Date.now()}`;
      const optimisticItem: CartItem = {
        ...item,
        key: optimisticKey,
        quantity,
      };

      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id && i.key.startsWith("opt-"));
        if (existing) {
          return prev.map((i) =>
            i.key === existing.key
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        return [...prev, optimisticItem];
      });
      setIsDrawerOpen(true);

      try {
        const res = await fetch("/api/store/cart/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ id: item.id, quantity }),
        });
        const data = await res.json();
        if (!res.ok) {
          setItems((prev) => prev.filter((i) => i.key !== optimisticKey));
          setError(data?.error ?? "Failed to add to cart");
          return;
        }
        setItems(Array.isArray(data.items) ? data.items : []);
        setTotals(data.totals ?? null);
        setShipping(data.shipping ?? null);
      } catch (e) {
        setItems((prev) => prev.filter((i) => i.key !== optimisticKey));
        setError(e instanceof Error ? e.message : "Failed to add to cart");
      }
    },
    []
  );

  const removeItem = useCallback(async (key: string) => {
    const removed = items.find((i) => i.key === key);
    setItems((prev) => prev.filter((i) => i.key !== key));
    setError(null);

    try {
      const res = await fetch("/api/store/cart/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ key }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (removed) setItems((prev) => [...prev, removed]);
        setError(data?.error ?? "Failed to remove item");
      } else if (Array.isArray(data.items)) {
        setItems(data.items);
        setTotals(data.totals ?? null);
        setShipping(data.shipping ?? null);
      }
    } catch (e) {
      if (removed) setItems((prev) => [...prev, removed]);
      setError(e instanceof Error ? e.message : "Failed to remove item");
    }
  }, [items]);

  const updateQuantity = useCallback(
    async (key: string, quantity: number) => {
      if (quantity < 1) {
        await removeItem(key);
        return;
      }
      const previousItems = items;
      setItems((prev) =>
        prev.map((i) => (i.key === key ? { ...i, quantity } : i))
      );
      setError(null);

      try {
        const res = await fetch("/api/store/cart/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ key, quantity }),
        });
        const data = await res.json();
        if (!res.ok) {
          setItems(previousItems);
          setError(data?.error ?? "Failed to update quantity");
        } else if (Array.isArray(data.items)) {
          setItems(data.items);
          setTotals(data.totals ?? null);
          setShipping(data.shipping ?? null);
        }
      } catch (e) {
        setItems(previousItems);
        setError(e instanceof Error ? e.message : "Failed to update quantity");
      }
    },
    [items, removeItem]
  );

  const clearCart = useCallback(() => setItems([]), []);
  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const totalItems = useMemo(
    () => items.reduce((acc, i) => acc + i.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      addItem,
      removeItem,
      updateQuantity,
      totalItems,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isLoading,
      error,
      totals,
      shipping,
    }),
    [
      items,
      addItem,
      removeItem,
      updateQuantity,
      totalItems,
      clearCart,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      isLoading,
      error,
      totals,
      shipping,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
