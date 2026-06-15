import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: false,
  serverExternalPackages: [
    "@aws-sdk/client-dynamodb",
    "@aws-sdk/lib-dynamodb",
  ],
};

export default nextConfig;
