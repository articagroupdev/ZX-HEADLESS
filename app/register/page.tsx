import Link from "next/link";

const STORE_URL = process.env.WOOCOMMERCE_STORE_URL ?? "https://zxline.us";
const WP_REGISTER_URL = `${STORE_URL}/wp-login.php?action=register`;
const MY_ACCOUNT_URL = `${STORE_URL}/my-account/`;

export const metadata = {
  title: "Crear cuenta",
  description: "Regístrate en ZX LINE",
};

export default function RegisterPage() {
  return (
    <div className="min-h-[60vh] bg-white px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-md">
        <h1
          className="mb-2 text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          Crear cuenta
        </h1>
        <p className="mb-8 text-center text-neutral-600">
          Te enviaremos un enlace para activar tu cuenta y elegir tu contraseña.
        </p>

        <form
          method="post"
          action={WP_REGISTER_URL}
          className="flex flex-col gap-5 rounded-xl border border-neutral-200 bg-neutral-50/50 p-4 shadow-sm sm:p-6"
        >
          <input type="hidden" name="redirect_to" value={MY_ACCOUNT_URL} />
          <div>
            <label
              htmlFor="user_login"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Usuario
            </label>
            <input
              id="user_login"
              name="user_login"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="nombre de usuario"
            />
          </div>
          <div>
            <label
              htmlFor="user_email"
              className="mb-1.5 block text-sm font-medium text-neutral-700"
            >
              Correo electrónico
            </label>
            <input
              id="user_email"
              name="user_email"
              type="email"
              autoComplete="email"
              required
              className="w-full rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
              placeholder="tu@email.com"
            />
          </div>
          <button
            type="submit"
            name="wp-submit"
            className="w-full rounded-lg bg-brand px-4 py-3 font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Crear cuenta
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-neutral-500">
          ¿Ya tienes cuenta?{" "}
          <Link href="/account" className="text-brand underline hover:no-underline">
            Iniciar sesión
          </Link>
        </p>

        <p className="mt-4 text-center">
          <Link
            href="/"
            className="text-sm text-neutral-500 underline hover:text-neutral-700"
          >
            ← Volver al inicio
          </Link>
        </p>
      </div>
    </div>
  );
}
