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
 * POST /api/store/cart/remove
 * Body: { key: string }
 * Elimina un ítem del carrito (Store API).
 */
export async function POST(request: NextRequest) {
  let body: { key?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { key: string }" },
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

  const { data, cartToken, status } = await fetchStoreApi(
    "/cart/remove-item",
    request,
    {
      method: "POST",
      searchParams: { key },
    }
  );

  if (status >= 400) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as { message: string }).message
        : "Failed to remove cart item";
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
