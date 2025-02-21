import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // ignore linting errors
  eslint: {
    ignoreDuringBuilds: true,
  },
  // ingore validity of types
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
