import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/account", "/account/", "/api/", "/cart"],
      },
    ],
    sitemap: "https://zxline.us/sitemap.xml",
  };
}
