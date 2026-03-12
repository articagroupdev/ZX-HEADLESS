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
 * POST /api/store/cart/update
 * Body: { key: string, quantity: number }
 * Actualiza la cantidad de un ítem en el carrito (Store API).
 */
export async function POST(request: NextRequest) {
  let body: { key?: string; quantity?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { key: string, quantity: number }" },
      { status: 400 }
    );
  }

  const key = body?.key;
  if (typeof key !== "string" || !key.trim()) {
    return NextResponse.json(
      { error: "Missing or invalid 'key' (cart item key)" },
      { status: 400 }
    );
  }

  const quantity = Math.max(0, Math.min(9999, Number(body?.quantity) ?? 0));

  const { data, cartToken, status } = await fetchStoreApi(
    "/cart/update-item",
    request,
    {
      method: "POST",
      searchParams: { key, quantity: String(quantity) },
    }
  );

  if (status >= 400) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as { message: string }).message
        : "Failed to update cart item";
    const response = NextResponse.json({ error: message }, { status });
    applyCartTokenToResponse(response, cartToken);
    return response;
  }

  const cart = data as StoreCartResponse;
  const response = NextResponse.json({
    items: cart.items.map(mapStoreCartItemToCartItem),
    totals: cart.totals,
    items_count: cart.items_count ?? 0,
    shipping: getSelectedShippingRate(cart),
  });
  applyCartTokenToResponse(response, cartToken);
  return response;
}
