import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ 警告: 生产环境建议开启类型检查
    ignoreBuildErrors: true,
  },
  eslint: {
    // 添加这个配置来忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  images: {
    minimumCacheTTL: 60, // 缓存时间(秒)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
