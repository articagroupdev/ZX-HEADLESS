"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFavorites } from "@/context/FavoritesContext";

export function AccountLogin() {
  const router = useRouter();
  const { refreshFavorites } = useFavorites();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/account/me")
      .then((res) => {
        if (cancelled) return;
        if (res.ok) router.replace("/account/dashboard");
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setCheckingSession(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const form = e.currentTarget;
    const username = (
      form.elements.namedItem("username") as HTMLInputElement
    )?.value?.trim();
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      ?.value;
    if (!username || !password) {
      setError("Usuario y contraseña son obligatorios");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Error al iniciar sesión");
        return;
      }
      await refreshFavorites();
      router.push("/account/dashboard");
      router.refresh();
    } catch {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  if (checkingSession) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && (
        <div
          className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
          role="alert"
        >
          {error}
        </div>
      )}
      <div>
        <label
          htmlFor="username"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500"
        >
          Usuario o correo
        </label>
        <input
          id="username"
          name="username"
          type="text"
          autoComplete="username"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="tu@email.com"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="mb-1 block text-xs font-medium uppercase tracking-wider text-neutral-500"
        >
          Contraseña de aplicación
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 bg-white px-3.5 py-2.5 text-neutral-900 placeholder:text-neutral-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          placeholder="••••••••"
        />
        <p className="mt-1.5 text-xs text-neutral-400">
          Genera una en la tienda: Mi cuenta → Detalles de la cuenta →
          Contraseñas de aplicación.
        </p>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="mt-1 w-full rounded-lg bg-brand py-3 font-semibold text-white transition hover:bg-brand-hover focus:outline-none focus:ring-2 focus:ring-brand focus:ring-offset-2 disabled:opacity-70"
        style={{ fontFamily: "var(--font-goldman), sans-serif" }}
      >
        {loading ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
