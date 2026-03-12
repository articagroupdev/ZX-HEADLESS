import { cookies } from "next/headers";
import { getFavorites, setFavorites } from "@/lib/woocommerce";

const COOKIE_NAME = "zx_customer_id";

/** Fusiona IDs de favoritos (ej. desde localStorage) con los del usuario y devuelve la lista final. */
export async function POST(request: Request) {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAME)?.value;
  if (!customerId) {
    return Response.json({ error: "No autorizado" }, { status: 401 });
  }
  const id = parseInt(customerId, 10);
  if (Number.isNaN(id)) {
    return Response.json({ error: "Sesión inválida" }, { status: 401 });
  }

  const body = await request.json().catch(() => ({}));
  const incoming =
    Array.isArray(body.productIds) ?
      body.productIds.filter((x: unknown): x is number => typeof x === "number" && Number.isInteger(x))
    : [];

  const current = await getFavorites(id);
  const merged = [...new Set([...current, ...incoming])];
  await setFavorites(id, merged);
  return Response.json({ productIds: merged });
}
