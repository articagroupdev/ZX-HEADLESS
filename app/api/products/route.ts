import { NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/woocommerce";

/** GET /api/products?ids=1,2,3 — devuelve productos por IDs (para favoritos, etc.). */
export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids");
  const ids = idsParam
    ? idsParam
        .split(",")
        .map((s) => parseInt(s.trim(), 10))
        .filter((n) => !Number.isNaN(n))
    : [];
  const products = await getProductsByIds(ids);
  return Response.json(products);
}
