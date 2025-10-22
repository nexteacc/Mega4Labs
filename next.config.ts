import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.ytimg.com",
      },
    ],
    // 开发环境禁用优化，避免私有 IP 检查问题
    unoptimized: process.env.NODE_ENV === "development",
  },
};

export default nextConfig;
