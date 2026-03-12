import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getProducts, getRelatedProducts, normalizeProductImageUrl, type WooProductImage } from "@/lib/woocommerce";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";
import { RelatedProducts } from "@/components/RelatedProducts";
import type { Metadata } from "next";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description:
      product.short_description?.replace(/<[^>]*>/g, "").slice(0, 160) ??
      undefined,
    openGraph: {
      title: product.name,
      images: product.image?.src
        ? [product.image.src]
        : product.images?.[0]?.src
          ? [product.images[0].src]
          : undefined,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Unificar imagen destacada + galería y normalizar URLs (//, relativas, http→https)
  const featured = product.image?.src ? product.image : null;
  const galleryImages: WooProductImage[] = product.images ?? [];
  const seen = new Set<string>();
  const normalized = (img: WooProductImage): WooProductImage | null => {
    const src = normalizeProductImageUrl(img.src);
    if (!src || !src.startsWith("http")) return null;
    return { ...img, src };
  };
  const gallery: WooProductImage[] = [];
  if (featured) {
    const n = normalized(featured);
    if (n && !seen.has(n.src)) {
      seen.add(n.src);
      gallery.push(n);
    }
  }
  for (const img of galleryImages) {
    const n = normalized(img);
    if (n && !seen.has(n.src)) {
      seen.add(n.src);
      gallery.push(n);
    }
  }
  if (gallery.length === 0 && galleryImages.length > 0) {
    galleryImages.forEach((img) => {
      const n = normalized(img);
      if (n) gallery.push(n);
    });
  }
  const mainImage =
    product.image?.src ? product.image : product.images?.[0];
  let imageSrc: string | null =
    gallery[0]?.src ?? (mainImage ? normalizeProductImageUrl(mainImage.src) : null) ?? null;
  if (imageSrc && !imageSrc.startsWith("http")) imageSrc = null;
  const price = product.price ?? product.regular_price;
  const hasSale =
    product.sale_price && product.sale_price !== product.regular_price;

  const firstCategorySlug = product.categories?.[0]?.slug;
  let relatedProducts =
    firstCategorySlug != null
      ? await getRelatedProducts(product.id, firstCategorySlug, 4)
      : [];
  if (relatedProducts.length === 0) {
    const others = await getProducts({ per_page: 8 });
    relatedProducts = others.filter((p) => p.id !== product.id).slice(0, 4);
  }

  return (
    <div className="min-h-screen bg-white text-neutral-900">
      {/* Breadcrumb minimal */}
      <div className="border-b border-neutral-100 bg-neutral-50/40">
        <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-5 lg:px-12">
          <nav
            className="text-[11px] tracking-wide text-neutral-400 sm:text-xs"
            aria-label="Breadcrumb"
          >
            <Link href="/" className="transition hover:text-neutral-600">
              Home
            </Link>
            <span className="mx-2 text-neutral-300">/</span>
            <Link
              href="/#products"
              className="transition hover:text-neutral-600"
            >
              Products
            </Link>
            <span className="mx-2 text-neutral-300">/</span>
            <span className="text-neutral-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main content: gallery + info */}
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12 lg:px-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          {/* Gallery: Embla swipe */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductGallery
              images={gallery}
              productName={product.name}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col">
            {product.categories?.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {product.categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?category=${cat.slug}`}
                    className="rounded-full border border-neutral-200/80 bg-white px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider text-neutral-500 transition hover:border-neutral-300 hover:text-neutral-700"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}

            <h1
              className="mb-4 text-2xl font-semibold tracking-tight text-neutral-900 sm:text-3xl lg:text-4xl lg:leading-tight"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              {product.name}
            </h1>

            <div className="mb-6 flex items-baseline gap-3">
              <span className="text-2xl font-semibold text-neutral-900 lg:text-3xl">
                ${price}
                <span className="ml-1.5 text-base font-normal text-neutral-500">
                  +Taxes
                </span>
              </span>
              {hasSale && product.regular_price && (
                <span className="text-lg text-neutral-400 line-through">
                  ${product.regular_price}
                </span>
              )}
            </div>

            {product.short_description && (
              <div
                className="prose prose-neutral prose-sm mb-8 max-w-none prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600"
                dangerouslySetInnerHTML={{
                  __html: product.short_description,
                }}
              />
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <AddToCartButton
                product={{
                  id: product.id,
                  name: product.name,
                  slug: product.slug,
                  price,
                  imageSrc,
                }}
                className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-brand px-8 py-3.5 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]"
              >
                Add to cart
              </AddToCartButton>
              <Link
                href="/cart"
                className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-neutral-300 bg-white px-8 py-3.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 active:scale-[0.98]"
              >
                View cart
              </Link>
            </div>

            {product.attributes && product.attributes.length > 0 && (
              <dl className="mt-10 border-t border-neutral-100 pt-8">
                <dt className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-neutral-400">
                  Details
                </dt>
                <dd className="space-y-2">
                  {product.attributes.map((attr) => (
                    <div
                      key={attr.id}
                      className="flex gap-2 text-sm text-neutral-700"
                    >
                      <span className="text-neutral-500">
                        {attr.name}:
                      </span>
                      <span>{attr.options?.join(", ")}</span>
                    </div>
                  ))}
                </dd>
              </dl>
            )}
          </div>
        </div>

        {/* Long description */}
        {product.description && product.description.trim() !== "" && (
          <section className="mt-16 border-t border-neutral-100 pt-12 sm:mt-20 sm:pt-16">
            <h2
              className="mb-6 text-2xl font-semibold tracking-tight text-brand sm:text-3xl"
              style={{ fontFamily: "var(--font-goldman), sans-serif" }}
            >
              Description
            </h2>
            <div
              className="prose prose-neutral max-w-none prose-p:text-neutral-600 prose-p:leading-relaxed prose-li:text-neutral-600"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </section>
        )}
      </div>

      {/* Related products */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
}
