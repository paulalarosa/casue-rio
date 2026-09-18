import type { NextConfig } from "next";

const prefixo = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  basePath: prefixo,
  assetPrefix: prefixo || undefined,
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
