import Link from "next/link";
import Image from "next/image";
import { getProducts, getCategories } from "@/lib/woocommerce";
import { ProductCard } from "@/components/ProductCard";
import type { Metadata } from "next";

const BASE_URL = "https://zxline.us";
const PRODUCTS_PER_PAGE = 24;
const SHOP_HERO_IMAGE_URL = "/img/shop-hero.webp";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps): Promise<Metadata> {
  const { category: categorySlug } = await searchParams;

  if (categorySlug) {
    const categories = await getCategories();
    const category = categories.find((c) => c.slug === categorySlug);
    const categoryName = category?.name ?? categorySlug;
    return {
      title: `${categoryName} — Shop`,
      description: `Shop ${categoryName} — premium intimate wellness products by ZX LINE. Discreet worldwide shipping.`,
      alternates: {
        canonical: `/shop?category=${categorySlug}`,
      },
      openGraph: {
        title: `${categoryName} — Shop | ZX LINE`,
        url: `/shop?category=${categorySlug}`,
      },
    };
  }

  return {
    title: "Shop",
    description:
      "Explore our full collection of premium lubricants and intimate wellness products. Discreet worldwide shipping. ZX LINE.",
    alternates: {
      canonical: "/shop",
    },
    openGraph: {
      title: "Shop | ZX LINE",
      url: "/shop",
    },
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { category: categorySlug } = await searchParams;
  const categories = await getCategories();
  const categoryId = categorySlug
    ? categories.find((c) => c.slug === categorySlug)?.id
    : undefined;

  const products = await getProducts({
    per_page: PRODUCTS_PER_PAGE,
    ...(categoryId !== undefined && { category: String(categoryId) }),
  });

  const activeCategorySlug = categorySlug ?? null;
  const hasHeroImage = Boolean(SHOP_HERO_IMAGE_URL?.trim());

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop",
        item: `${BASE_URL}/shop`,
      },
      ...(activeCategorySlug
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name:
                categories.find((c) => c.slug === activeCategorySlug)?.name ??
                activeCategorySlug,
              item: `${BASE_URL}/shop?category=${activeCategorySlug}`,
            },
          ]
        : []),
    ],
  };

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      {/* Hero */}
      <section className="relative flex min-h-[28vh] items-center justify-center overflow-hidden px-4 py-10 sm:min-h-[40vh] sm:px-6 sm:py-20 lg:min-h-[45vh] lg:py-28">
        {hasHeroImage ? (
          <>
            <div className="absolute inset-0 z-0">
              <Image
                src={SHOP_HERO_IMAGE_URL}
                alt=""
                fill
                className="object-cover object-center"
                sizes="100vw"
                priority
              />
            </div>
            <div className="absolute inset-0 z-0 bg-black/50" />
            <div className="relative z-10 text-center">
              <h1
                className="text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Shop
              </h1>
              <p className="mt-2 text-base text-white/90 sm:mt-3 sm:text-lg">
                Premium intimate wellness. Discreet shipping.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="absolute inset-0 z-0 bg-neutral-200" />
            <div className="relative z-10 text-center">
              <h1
                className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl md:text-5xl lg:text-6xl"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                Shop
              </h1>
              <p className="mt-2 text-base text-neutral-600 sm:mt-3 sm:text-lg">
                Premium intimate wellness. Discreet shipping.
              </p>
            </div>
          </>
        )}
      </section>

      <div className="px-4 py-6 sm:px-6 sm:py-10 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">
          {/* Breadcrumb */}
          <nav className="mb-6 text-xs text-neutral-500 sm:mb-8 sm:text-sm" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-neutral-900">
              Home
            </Link>
            <span className="mx-2">/</span>
            {activeCategorySlug ? (
              <>
                <Link href="/shop" className="hover:text-neutral-900">
                  Shop
                </Link>
                <span className="mx-2">/</span>
                <span className="text-neutral-900">
                  {categories.find((c) => c.slug === activeCategorySlug)?.name ?? activeCategorySlug}
                </span>
              </>
            ) : (
              <span className="text-neutral-900">Shop</span>
            )}
          </nav>

          {/* Category filter */}
          {categories.length > 0 && (
            <nav
              className="mb-6 flex flex-wrap gap-2 border-b border-neutral-200 pb-4 sm:mb-10 sm:pb-6 min-w-0"
              aria-label="Filter by category"
            >
              <Link
                href="/shop"
                className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  !activeCategorySlug
                    ? "bg-brand text-white"
                    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                }`}
                style={
                  !activeCategorySlug
                    ? { fontFamily: "var(--font-goldman), sans-serif" }
                    : undefined
                }
              >
                All
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    activeCategorySlug === cat.slug
                      ? "bg-brand text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                  style={
                    activeCategorySlug === cat.slug
                      ? { fontFamily: "var(--font-goldman), sans-serif" }
                      : undefined
                  }
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          )}

          {/* Product grid */}
          {products.length > 0 ? (
            <ul className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4 min-w-0">
              {products.map((product, index) => (
                <li key={product.id}>
                  <ProductCard product={product} index={index} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-14 text-center sm:py-20">
              <p className="text-base font-medium text-neutral-700 sm:text-lg">
                No products in this category right now.
              </p>
              <p className="mt-2 text-sm text-neutral-500">
                Try another category or check back later.
              </p>
              <Link
                href="/shop"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 active:scale-[0.98]"
                style={{ fontFamily: "var(--font-goldman), sans-serif" }}
              >
                View all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
