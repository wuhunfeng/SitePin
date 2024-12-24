import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ 警告: 生产环境建议开启类型检查
    ignoreBuildErrors: true,
  },
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
