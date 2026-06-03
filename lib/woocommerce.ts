/**
 * WooCommerce REST API (solo servidor).
 */

const STORE_URL = process.env.WOOCOMMERCE_STORE_URL ?? "https://zxline.us";
const CONSUMER_KEY = process.env.WC_CONSUMER_KEY ?? "";
const CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET ?? "";

/**
 * Normaliza la URL de una imagen de WooCommerce para que Next/Image pueda cargarla.
 * - Protocol-relative (//...) → https:
 * - Rutas relativas (/) → URL base de la tienda
 * - http del mismo host → https para evitar mixed content
 */
export function normalizeProductImageUrl(src: string | undefined | null): string {
  if (!src || typeof src !== "string") return "";
  const trimmed = src.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  if (trimmed.startsWith("/")) {
    const base = STORE_URL.replace(/\/$/, "");
    return `${base}${trimmed}`;
  }
  if (trimmed.startsWith("http:")) {
    try {
      const u = new URL(trimmed);
      return `https://${u.host}${u.pathname}${u.search}${u.hash}`;
    } catch {
      return trimmed;
    }
  }
  return trimmed;
}

export interface WooProductImage {
  id: number;
  src: string;
  alt: string;
  name: string;
}

export interface WooProduct {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  /** Imagen destacada (WooCommerce a veces la devuelve solo aquí) */
  image?: WooProductImage | null;
  images?: WooProductImage[];
  short_description: string;
  description?: string;
  categories: { id: number; name: string; slug: string }[];
  attributes?: { id: number; name: string; options: string[] }[];
}

// Use query string auth — more reliable on cPanel/Apache where Authorization headers get stripped
function addAuth(params: URLSearchParams): void {
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error("WooCommerce: missing credentials — WC_CONSUMER_KEY or WC_CONSUMER_SECRET not set");
  }
  params.set("consumer_key", CONSUMER_KEY);
  params.set("consumer_secret", CONSUMER_SECRET);
}

export async function getProducts(params?: {
  per_page?: number;
  category?: string;
}): Promise<WooProduct[]> {
  const perPage = params?.per_page ?? 12;
  const searchParams = new URLSearchParams({
    per_page: String(perPage),
    status: "publish",
    ...(params?.category && { category: params.category }),
  });
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/products?${searchParams}`;

  const res = await fetch(url, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("WooCommerce API error:", res.status, text);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/**
 * Productos relacionados por categoría (excluye el producto actual).
 */
export async function getRelatedProducts(
  productId: number,
  categorySlug: string,
  limit = 4
): Promise<WooProduct[]> {
  const products = await getProducts({
    category: categorySlug,
    per_page: limit + 6,
  });
  return products.filter((p) => p.id !== productId).slice(0, limit);
}

export interface WooCategory {
  id: number;
  name: string;
  slug: string;
  count?: number;
}

export async function getCategories(): Promise<WooCategory[]> {
  const searchParams = new URLSearchParams({ per_page: "50" });
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/products/categories?${searchParams}`;

  const res = await fetch(url, {
    next: { revalidate: 120 },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("WooCommerce API error (categories):", res.status, text);
    return [];
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** Productos por IDs (para listados como favoritos). */
export async function getProductsByIds(ids: number[]): Promise<WooProduct[]> {
  const unique = [...new Set(ids)].filter(Number.isInteger).slice(0, 50);
  if (unique.length === 0) return [];
  const searchParams = new URLSearchParams({
    include: unique.join(","),
    status: "publish",
    per_page: String(unique.length),
  });
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/products?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 60 } });
  if (!res.ok) return [];
  const data = await res.json();
  const list = Array.isArray(data) ? data : [];
  return list.filter((p: WooProduct) => unique.includes(p.id));
}

export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const searchParams = new URLSearchParams({ slug, status: "publish" });
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/products?${searchParams}`;

  const res = await fetch(url, { next: { revalidate: 60 } });

  if (!res.ok) {
    const text = await res.text();
    console.error("WooCommerce API error (product):", res.status, text);
    return null;
  }

  const data = await res.json();
  const product = Array.isArray(data) ? data[0] : data;
  return product ?? null;
}

const FAVORITES_META_KEY = "zx_favorites";

/** Cliente por ID (para panel de cuenta). Requiere auth de admin. */
export interface WooCustomer {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  billing?: Record<string, string>;
  shipping?: Record<string, string>;
  meta_data?: { id?: number; key: string; value: string }[];
}

export async function getCustomer(
  customerId: number
): Promise<WooCustomer | null> {
  const searchParams = new URLSearchParams();
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/customers/${customerId}?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return null;
  return res.json();
}

/** Pedidos de un cliente (para panel). */
export interface WooOrder {
  id: number;
  status: string;
  total: string;
  date_created: string;
  line_items?: { name: string; quantity: number; total: string }[];
}

export async function getOrdersByCustomer(
  customerId: number
): Promise<WooOrder[]> {
  const searchParams = new URLSearchParams({ customer: String(customerId), per_page: "20" });
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/orders?${searchParams}`;
  const res = await fetch(url, { next: { revalidate: 0 } });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

/** IDs de productos favoritos del cliente (meta_data en WooCommerce). */
export async function getFavorites(customerId: number): Promise<number[]> {
  const customer = await getCustomer(customerId);
  if (!customer?.meta_data) return [];
  const entry = customer.meta_data.find((m) => m.key === FAVORITES_META_KEY);
  if (!entry?.value) return [];
  try {
    const arr = JSON.parse(entry.value) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter((id): id is number => typeof id === "number" && Number.isInteger(id));
  } catch {
    return [];
  }
}

/** Actualiza la lista de favoritos del cliente. */
export async function setFavorites(
  customerId: number,
  productIds: number[]
): Promise<number[]> {
  const customer = await getCustomer(customerId);
  if (!customer) return [];
  const meta_data = customer.meta_data ?? [];
  const existing = meta_data.find((m) => m.key === FAVORITES_META_KEY);
  const value = JSON.stringify(productIds);
  const newMeta = existing
    ? meta_data.map((m) =>
        m.key === FAVORITES_META_KEY ? { ...m, value } : m
      )
    : [...meta_data, { key: FAVORITES_META_KEY, value }];

  const searchParams = new URLSearchParams();
  addAuth(searchParams);
  const url = `${STORE_URL}/wp-json/wc/v3/customers/${customerId}?${searchParams}`;
  const res = await fetch(url, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ meta_data: newMeta }),
    cache: "no-store",
  });
  if (!res.ok) return [];
  return productIds;
}
