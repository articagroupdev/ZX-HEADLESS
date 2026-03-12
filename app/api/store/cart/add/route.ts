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
 * POST /api/store/cart/add
 * Body: { id: number, quantity?: number }
 * Añade un producto al carrito (Store API) y devuelve el carrito actualizado.
 */
export async function POST(request: NextRequest) {
  let body: { id?: number; quantity?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body. Expected { id: number, quantity?: number }" },
      { status: 400 }
    );
  }

  const id = body?.id;
  if (id == null || typeof id !== "number") {
    return NextResponse.json(
      { error: "Missing or invalid 'id' (product ID)" },
      { status: 400 }
    );
  }

  const quantity = Math.max(1, Math.min(9999, Number(body?.quantity) || 1));

  const { data, cartToken, status } = await fetchStoreApi("/cart/add-item", request, {
    method: "POST",
    searchParams: { id: String(id), quantity: String(quantity) },
  });

  if (status >= 400) {
    const message =
      data && typeof data === "object" && "message" in data
        ? (data as { message: string }).message
        : "Failed to add to cart";
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
