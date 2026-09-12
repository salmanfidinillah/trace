import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  typedRoutes: true,
  devIndicators: false,
  serverExternalPackages: ["firebase-admin"],
};

export default nextConfig;
