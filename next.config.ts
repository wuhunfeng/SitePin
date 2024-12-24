import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'urlscan.io',
        pathname: '/liveshot/**',
      },
    ],
  },
};

export default nextConfig;
