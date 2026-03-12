import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zxline.us",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
