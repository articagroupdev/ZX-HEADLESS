import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

async function checkWooCommerce(): Promise<{ ok: boolean; status: number; error?: string }> {
  try {
    const storeUrl = process.env.WOOCOMMERCE_STORE_URL ?? "https://zxline.us";
    const key = process.env.WC_CONSUMER_KEY ?? "";
    const secret = process.env.WC_CONSUMER_SECRET ?? "";
    const params = new URLSearchParams({ consumer_key: key, consumer_secret: secret, per_page: "1" });
    const res = await fetch(`${storeUrl}/wp-json/wc/v3/products?${params}`, { cache: "no-store" });
    if (!res.ok) {
      const text = await res.text();
      return { ok: false, status: res.status, error: text.slice(0, 300) };
    }
    return { ok: true, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: e instanceof Error ? e.message : String(e) };
  }
}

function Row({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  const color =
    ok === true ? "text-green-600" : ok === false ? "text-red-500" : "text-neutral-700";
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-100 py-3 last:border-0">
      <span className="text-sm font-medium text-neutral-500">{label}</span>
      <span className={`text-right text-sm font-mono ${color}`}>{value}</span>
    </div>
  );
}

export default async function SystemPage() {
  const cookieStore = await cookies();
  const customerId = cookieStore.get("zx_customer_id")?.value;
  if (!customerId) redirect("/account");

  const woo = await checkWooCommerce();

  const cwd = process.cwd();
  const publicImgPath = path.join(cwd, "public", "img");
  const publicImgExists = fs.existsSync(publicImgPath);
  const publicImgFiles = publicImgExists
    ? fs.readdirSync(publicImgPath).slice(0, 20)
    : [];

  const vars = {
    WC_CONSUMER_KEY: process.env.WC_CONSUMER_KEY,
    WC_CONSUMER_SECRET: process.env.WC_CONSUMER_SECRET,
    WOOCOMMERCE_STORE_URL: process.env.WOOCOMMERCE_STORE_URL,
    NEXT_PUBLIC_WORDPRESS_CHECKOUT_URL: process.env.NEXT_PUBLIC_WORDPRESS_CHECKOUT_URL,
  };

  const mask = (v?: string) =>
    v ? `${v.slice(0, 6)}...${v.slice(-4)}` : null;

  return (
    <div className="min-h-[60vh] bg-neutral-50/50 px-4 py-8 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
      <div className="mx-auto max-w-2xl space-y-6">
        <h1
          className="text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl"
          style={{ fontFamily: "var(--font-goldman), sans-serif" }}
        >
          System Status
        </h1>

        {/* Entorno */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Entorno
          </h2>
          <Row label="Fecha / hora" value={new Date().toISOString()} />
          <Row label="NODE_ENV" value={process.env.NODE_ENV ?? "—"} />
          <Row label="Node version" value={process.version} />
          <Row label="process.cwd()" value={cwd} />
          <Row
            label="public/img existe"
            value={publicImgExists ? "✓ Sí" : "❌ No encontrado"}
            ok={publicImgExists}
          />
          {publicImgExists && (
            <div className="mt-3 rounded-lg bg-neutral-50 p-3 text-xs font-mono text-neutral-600 break-all">
              {publicImgFiles.join(" · ")}
            </div>
          )}
        </section>

        {/* Variables de entorno */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            Variables de entorno
          </h2>
          <Row
            label="WC_CONSUMER_KEY"
            value={vars.WC_CONSUMER_KEY ? mask(vars.WC_CONSUMER_KEY)! : "❌ MISSING"}
            ok={Boolean(vars.WC_CONSUMER_KEY)}
          />
          <Row
            label="WC_CONSUMER_SECRET"
            value={vars.WC_CONSUMER_SECRET ? mask(vars.WC_CONSUMER_SECRET)! : "❌ MISSING"}
            ok={Boolean(vars.WC_CONSUMER_SECRET)}
          />
          <Row
            label="WOOCOMMERCE_STORE_URL"
            value={vars.WOOCOMMERCE_STORE_URL ?? "(default: https://zxline.us)"}
          />
          <Row
            label="WP_CHECKOUT_URL"
            value={vars.NEXT_PUBLIC_WORDPRESS_CHECKOUT_URL ?? "❌ MISSING"}
            ok={Boolean(vars.NEXT_PUBLIC_WORDPRESS_CHECKOUT_URL)}
          />
        </section>

        {/* WooCommerce API */}
        <section className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">
            WooCommerce API
          </h2>
          <Row
            label="Conexión"
            value={woo.ok ? `✓ OK (${woo.status})` : `❌ Error (${woo.status})`}
            ok={woo.ok}
          />
          {woo.error && (
            <div className="mt-3 rounded-lg bg-red-50 p-3 text-xs font-mono text-red-600 break-all">
              {woo.error}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
