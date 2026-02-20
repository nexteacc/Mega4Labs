import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: false, // 明确关闭 React Compiler，规避与 Turbopack HMR 的冲突 bug
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
  // 确保 sitemap 和 robots.txt 有正确的缓存策略
  async headers() {
    return [
      {
        source: "/sitemap.xml",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "application/xml; charset=utf-8",
          },
        ],
      },
      {
        source: "/robots.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
          {
            key: "Content-Type",
            value: "text/plain; charset=utf-8",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
