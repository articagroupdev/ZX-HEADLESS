import Link from "next/link";
import { AccountLogin } from "@/components/AccountLogin";

export const metadata = {
  title: "Acceder",
  description: "Inicia sesión en tu cuenta ZX LINE",
};

export default function AccountPage() {
  return (
    <div className="min-h-[70vh] bg-neutral-50/80 px-4 py-10 sm:px-6 sm:py-14 lg:px-12 lg:py-16">
      <div className="mx-auto max-w-[400px]">
        <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <h1
            className="mb-1 text-2xl font-semibold tracking-tight text-neutral-900"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Acceder
          </h1>
          <p className="mb-6 text-sm text-neutral-500">
            Introduce tu usuario y contraseña de aplicación.
          </p>
          <AccountLogin />
        </div>
        <p className="mt-6 text-center text-sm text-neutral-500">
          ¿No tienes cuenta?{" "}
          <Link
            href="/register"
            className="font-medium text-brand underline hover:no-underline"
          >
            Crear cuenta
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
