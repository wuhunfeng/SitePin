import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'urlscan.io',
        pathname: '/liveshot/**',
      },
      {
        protocol: 'https',
        hostname: 'pic.906051999.xyz',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
