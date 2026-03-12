"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

const STORAGE_KEY = "zx_favorites";

function getStoredIds(): number[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((id): id is number => typeof id === "number" && Number.isInteger(id));
  } catch {
    return [];
  }
}

function setStoredIds(ids: number[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore
  }
}

interface FavoritesContextValue {
  productIds: number[];
  isFavorite: (productId: number) => boolean;
  addFavorite: (productId: number) => Promise<void>;
  removeFavorite: (productId: number) => Promise<void>;
  toggleFavorite: (productId: number) => Promise<void>;
  refreshFavorites: () => Promise<void>;
  isLoading: boolean;
  isLoggedIn: boolean | null;
}

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [productIds, setProductIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  const load = useCallback(async () => {
    try {
      const meRes = await fetch("/api/account/me", { credentials: "include" });
      const loggedIn = meRes.ok;

      if (loggedIn) {
        const favRes = await fetch("/api/favorites", { credentials: "include" });
        const data = favRes.ok ? await favRes.json() : { productIds: [] };
        const ids = Array.isArray(data?.productIds) ? data.productIds : [];
        setProductIds(ids);

        const localIds = getStoredIds();
        if (localIds.length > 0) {
          const mergeRes = await fetch("/api/favorites/merge", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ productIds: localIds }),
          });
          if (mergeRes.ok) {
            const merged = await mergeRes.json();
            const mergedIds = Array.isArray(merged?.productIds) ? merged.productIds : ids;
            setProductIds(mergedIds);
            setStoredIds([]);
          }
        }
      } else {
        setProductIds(getStoredIds());
      }
      setIsLoggedIn(loggedIn);
    } catch {
      setProductIds(getStoredIds());
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addFavorite = useCallback(
    async (productId: number) => {
      if (isLoggedIn === true) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId, action: "add" }),
        });
        if (res.ok) {
          const data = await res.json();
          setProductIds(Array.isArray(data?.productIds) ? data.productIds : [...productIds, productId]);
        }
      } else {
        const next = productIds.includes(productId) ? productIds : [...productIds, productId];
        setProductIds(next);
        setStoredIds(next);
      }
    },
    [isLoggedIn, productIds]
  );

  const removeFavorite = useCallback(
    async (productId: number) => {
      if (isLoggedIn === true) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ productId, action: "remove" }),
        });
        if (res.ok) {
          const data = await res.json();
          setProductIds(Array.isArray(data?.productIds) ? data.productIds : productIds.filter((id) => id !== productId));
        }
      } else {
        const next = productIds.filter((id) => id !== productId);
        setProductIds(next);
        setStoredIds(next);
      }
    },
    [isLoggedIn, productIds]
  );

  const toggleFavorite = useCallback(
    async (productId: number) => {
      if (productIds.includes(productId)) {
        await removeFavorite(productId);
      } else {
        await addFavorite(productId);
      }
    },
    [productIds, addFavorite, removeFavorite]
  );

  const isFavorite = useCallback(
    (id: number) => productIds.includes(id),
    [productIds]
  );

  const value: FavoritesContextValue = {
    productIds,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites: load,
    isLoading,
    isLoggedIn,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}
