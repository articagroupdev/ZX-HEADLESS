/**
 * Tipos para WooCommerce Store API (carrito).
 * @see https://developer.woocommerce.com/docs/apis/store-api/resources-endpoints/cart/
 */

export interface StoreCartImage {
  id: number;
  src: string;
  thumbnail?: string;
  alt?: string;
  name?: string;
}

export interface StoreCartItemPrices {
  price: string;
  regular_price: string;
  sale_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

export interface StoreCartItem {
  key: string;
  id: number;
  quantity: number;
  name: string;
  permalink: string;
  images: StoreCartImage[];
  prices: StoreCartItemPrices;
  totals?: {
    line_subtotal: string;
    line_total: string;
    currency_minor_unit: number;
  };
}

export interface StoreCartTotals {
  total_items: string;
  total_items_tax: string;
  total_fees: string;
  total_fees_tax: string;
  total_discount: string;
  total_discount_tax: string;
  total_shipping: string;
  total_shipping_tax: string;
  total_price: string;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
  currency_decimal_separator: string;
  currency_thousand_separator: string;
  currency_prefix: string;
  currency_suffix: string;
}

export interface StoreCartShippingRate {
  rate_id: string;
  name: string;
  price: string;
  taxes: string;
  instance_id: number;
  method_id: string;
  selected: boolean;
  currency_code: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

export interface StoreCartShippingPackage {
  package_id: number;
  name: string;
  shipping_rates: StoreCartShippingRate[];
}

export interface StoreCartResponse {
  items: StoreCartItem[];
  totals: StoreCartTotals;
  items_count: number;
  /** Paquetes y tarifas de envío calculadas (incluye UPS si está configurado). */
  shipping_rates?: StoreCartShippingPackage[];
}

/** Slug desde permalink (último segmento antes de ? o #). */
export function getSlugFromPermalink(permalink: string): string {
  try {
    const path = new URL(permalink).pathname.replace(/\/$/, "");
    const segment = path.split("/").filter(Boolean).pop();
    return segment ?? "";
  } catch {
    return "";
  }
}

/** Convierte precio en minor units a string "XX.XX". */
export function formatPriceFromMinorUnits(
  value: string | number,
  minorUnit: number = 2
): string {
  const n = typeof value === "string" ? parseInt(value, 10) : value;
  if (Number.isNaN(n)) return "0.00";
  const divisor = Math.pow(10, minorUnit);
  return (n / divisor).toFixed(minorUnit);
}

export interface CartItemMapped {
  id: number;
  key: string;
  name: string;
  slug: string;
  price: string;
  imageSrc: string | null;
  quantity: number;
}

/** Mapea un ítem del carrito Store API al formato usado en la UI. */
export function mapStoreCartItemToCartItem(item: StoreCartItem): CartItemMapped {
  const minorUnit = item.prices.currency_minor_unit ?? 2;
  return {
    id: item.id,
    key: item.key,
    name: item.name,
    slug: getSlugFromPermalink(item.permalink),
    price: formatPriceFromMinorUnits(item.prices.price, minorUnit),
    imageSrc: item.images?.[0]?.src ?? null,
    quantity: item.quantity,
  };
}

export interface SimpleShippingRate {
  name: string;
  price: string;
  currency_symbol: string;
  currency_minor_unit: number;
}

/** Devuelve la tarifa de envío seleccionada (por ejemplo, UPS) si existe. */
export function getSelectedShippingRate(
  cart: StoreCartResponse
): SimpleShippingRate | null {
  const packages = cart.shipping_rates;
  if (!packages || packages.length === 0) return null;

  for (const pkg of packages) {
    const rates = pkg.shipping_rates ?? [];
    if (!rates.length) continue;
    const selected = rates.find((r) => r.selected) ?? rates[0];
    if (selected) {
      return {
        name: selected.name,
        price: selected.price,
        currency_symbol: selected.currency_symbol,
        currency_minor_unit: selected.currency_minor_unit,
      };
    }
  }

  return null;
}
