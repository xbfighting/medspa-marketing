import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts', 'framer-motion']
  },
  images: {
    formats: ['image/webp', 'image/avif']
  }
};

export default nextConfig;
