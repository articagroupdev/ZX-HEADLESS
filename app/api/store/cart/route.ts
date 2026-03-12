import { NextRequest, NextResponse } from "next/server";
import {
  fetchStoreApi,
  applyCartTokenToResponse,
} from "@/lib/store-api-server";
import type { StoreCartResponse } from "@/lib/store-api-types";
import {
  mapStoreCartItemToCartItem,
  getSelectedShippingRate,
} from "@/lib/store-api-types";

/**
 * GET /api/store/cart
 * Devuelve el carrito actual (Store API). Formato normalizado para la UI.
 */
export async function GET(request: NextRequest) {
  const { data, cartToken, status } = await fetchStoreApi("/cart", request);

  let jsonBody:
    | {
        items: unknown[];
        totals: StoreCartResponse["totals"] | null;
        items_count: number;
        shipping: unknown | null;
      }
    | { items: unknown[]; totals: null; items_count: 0; shipping: null };

  if (status === 200 && data && typeof data === "object" && "items" in data) {
    const cart = data as StoreCartResponse;
    jsonBody = {
      items: cart.items.map(mapStoreCartItemToCartItem),
      totals: cart.totals,
      items_count: cart.items_count ?? 0,
      shipping: getSelectedShippingRate(cart),
    };
  } else {
    jsonBody = { items: [], totals: null, items_count: 0, shipping: null };
  }

  const response = NextResponse.json(jsonBody, {
    status: status >= 400 ? status : 200,
  });

  applyCartTokenToResponse(response, cartToken);
  return response;
}
