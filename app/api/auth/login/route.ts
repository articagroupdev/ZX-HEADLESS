import { NextRequest, NextResponse } from "next/server";

const STORE_URL = process.env.WOOCOMMERCE_STORE_URL ?? "https://zxline.us";
const COOKIE_NAME = "zx_customer_id";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 días

/**
 * Login headless: valida usuario con WordPress (Application Password)
 * y guarda el ID de cliente en cookie para las rutas /api/account/*.
 * En WordPress el usuario debe usar "Contraseña de aplicación" (Mi cuenta > Detalles de la cuenta > Contraseñas de aplicación).
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const username = body?.username?.trim();
    const password = body?.password;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Usuario y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const auth = Buffer.from(`${username}:${password}`).toString("base64");
    const res = await fetch(`${STORE_URL}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      if (res.status === 401) {
        return NextResponse.json(
          { error: "Usuario o contraseña incorrectos" },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: "No se pudo validar la sesión" },
        { status: 502 }
      );
    }

    const user = await res.json();
    const customerId = user.id;

    const response = NextResponse.json({ ok: true });
    response.cookies.set(COOKIE_NAME, String(customerId), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
    });
    return response;
  } catch (e) {
    console.error("Login error:", e);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
