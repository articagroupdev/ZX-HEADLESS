import { cookies } from "next/headers";
import { getFavorites, setFavorites } from "@/lib/woocommerce";

const COOKIE_NAME = "zx_customer_id";

export async function GET() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAME)?.value;
  if (!customerId) {
    return Response.json({ productIds: [] }, { status: 200 });
  }
  const id = parseInt(customerId, 10);
  if (Number.isNaN(id)) {
    return Response.json({ productIds: [] }, { status: 200 });
  }
  const productIds = await getFavorites(id);
  return Response.json({ productIds });
}

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
  const productId = typeof body.productId === "number" ? body.productId : undefined;
  const action = body.action === "add" || body.action === "remove" ? body.action : undefined;

  if (productId === undefined || !action) {
    return Response.json(
      { error: "Se requieren productId y action (add | remove)" },
      { status: 400 }
    );
  }

  const current = await getFavorites(id);
  const nextIds =
    action === "add"
      ? current.includes(productId)
        ? current
        : [...current, productId]
      : current.filter((x) => x !== productId);

  await setFavorites(id, nextIds);
  return Response.json({ productIds: nextIds });
}
