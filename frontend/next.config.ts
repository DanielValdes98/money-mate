import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone", 
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignorar errores de ESLint en el build
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "**",
      },
    ],
  },
  trailingSlash: true, 
};

export default nextConfig;
