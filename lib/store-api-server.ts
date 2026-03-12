/**
 * Helpers para llamar a la WooCommerce Store API desde Route Handlers.
 * La sesión del carrito se mantiene con el header Cart-Token (guardado en cookie).
 */

import { NextResponse } from "next/server";

const STORE_API_BASE =
  (process.env.WOOCOMMERCE_STORE_URL ?? "https://zxline.us").replace(
    /\/$/,
    ""
  ) + "/wp-json/wc/store/v1";

export const CART_TOKEN_COOKIE = "wc_cart_token";

function getCartTokenFromRequest(request: Request): string | undefined {
  const cookieHeader = request.headers.get("cookie");
  if (!cookieHeader) return undefined;
  const match = cookieHeader.match(new RegExp(`${CART_TOKEN_COOKIE}=([^;]+)`));
  return match?.[1]?.trim();
}

function buildCartTokenCookie(value: string, maxAge: number = 60 * 60 * 24 * 7): string {
  return `${CART_TOKEN_COOKIE}=${value}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`;
}

export interface StoreApiOptions {
  method?: "GET" | "POST";
  body?: Record<string, unknown> | null;
  searchParams?: Record<string, string>;
}

/**
 * Llama a un endpoint de la Store API, reenvía el Cart-Token y aplica
 * el nuevo Cart-Token de la respuesta a la NextResponse.
 */
export async function fetchStoreApi(
  path: string,
  request: Request,
  options: StoreApiOptions = {}
): Promise<{ data: unknown; cartToken: string | null; status: number }> {
  const { method = "GET", body, searchParams } = options;
  const token = getCartTokenFromRequest(request);
  const url = new URL(STORE_API_BASE + path);
  if (searchParams) {
    Object.entries(searchParams).forEach(([k, v]) =>
      url.searchParams.set(k, v)
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers["Cart-Token"] = token;

  const res = await fetch(url.toString(), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const cartToken = res.headers.get("Cart-Token")?.trim() ?? null;
  let data: unknown;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  return { data, cartToken, status: res.status };
}

/**
 * Añade la cookie Cart-Token a la respuesta si el servidor devolvió una.
 */
export function applyCartTokenToResponse(
  response: NextResponse,
  cartToken: string | null
): void {
  if (cartToken) {
    response.headers.append("Set-Cookie", buildCartTokenCookie(cartToken));
  }
}
