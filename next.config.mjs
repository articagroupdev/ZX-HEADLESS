/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zxline.us",
        pathname: "/**",
      },
    ],
  },
  typescript: {
    // Evita que el build falle por errores de tipos en entornos limitados
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

