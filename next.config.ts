import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://empire.apphero.agency/api/:path*",
      },
    ];
  },
};

export default nextConfig;