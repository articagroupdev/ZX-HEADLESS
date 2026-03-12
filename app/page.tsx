import { getProducts } from "@/lib/woocommerce";
import { Hero } from "@/components/Hero";
import { ProductCarousel } from "@/components/ProductCarousel";
import { About } from "@/components/About";
import { PromoBanner } from "@/components/PromoBanner";
import { WhyChoose } from "@/components/WhyChoose";
import { Testimonials } from "@/components/Testimonials";
import { Newsletter } from "@/components/Newsletter";

/** URL del video de fondo del hero. Pega aquí la URL cuando la tengas; si está vacía se usa la imagen. */
const HERO_VIDEO_URL = "https://zxline.us/wp-content/uploads/2025/07/0_Woman_Portrait_3840x2160.mp4";

function getFirstImageUrl(
  product: { image?: { src?: string } | null; images?: { src?: string }[] }
): string | null {
  if (product.image?.src?.startsWith("http")) return product.image.src;
  if (product.images?.[0]?.src?.startsWith("http")) return product.images[0].src;
  return null;
}

export default async function Home() {
  const products = await getProducts({ per_page: 12 });
  const heroImageUrl = products.length > 0 ? getFirstImageUrl(products[0]) : null;
  const aboutImageUrl =
    products.length > 1 ? getFirstImageUrl(products[1]) : heroImageUrl;

  return (
    <>
      <Hero
        backgroundImageUrl={heroImageUrl}
        videoUrl={HERO_VIDEO_URL || null}
      />
      <section
        id="products"
        className="border-t border-neutral-200 bg-white px-4 py-10 sm:px-6 sm:py-20 lg:px-12"
        aria-labelledby="products-heading"
      >
        <div className="mx-auto max-w-6xl">
          <h2
            id="products-heading"
            className="mb-6 text-center text-2xl font-semibold tracking-tight text-neutral-900 sm:mb-12 sm:text-3xl lg:text-4xl"
            style={{ fontFamily: "var(--font-goldman), sans-serif" }}
          >
            Products
          </h2>
          <ProductCarousel products={products} />
          {products.length === 0 && (
            <p className="text-center text-neutral-500">
              No products available at the moment.
            </p>
          )}
        </div>
      </section>
      <About backgroundImageUrl={aboutImageUrl} />
      <PromoBanner />
      <WhyChoose />
      <Testimonials />
      <Newsletter />
    </>
  );
}
