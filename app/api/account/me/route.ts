import { cookies } from "next/headers";
import { getCustomer } from "@/lib/woocommerce";

const COOKIE_NAME = "zx_customer_id";

export async function GET() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get(COOKIE_NAME)?.value;
  if (!customerId) {
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const id = parseInt(customerId, 10);
  if (Number.isNaN(id)) {
    return new Response(JSON.stringify({ error: "Sesión inválida" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const customer = await getCustomer(id);
  if (!customer) {
    return new Response(JSON.stringify({ error: "Cliente no encontrado" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  return Response.json(customer);
}
