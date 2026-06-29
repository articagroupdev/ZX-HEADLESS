import { getProducts } from "@/lib/woocommerce";
import type { MetadataRoute } from "next";

const BASE_URL = "https://zxline.us";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/zx-line`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  let productPages: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts({ per_page: 100 });
    productPages = products.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // WooCommerce unavailable at build time — product URLs omitted from sitemap
  }

  return [...staticPages, ...productPages];
}
