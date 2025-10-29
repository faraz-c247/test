import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // WARNING: Temporarily ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // WARNING: Temporarily ignore TypeScript type errors during builds
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
