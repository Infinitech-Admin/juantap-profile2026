import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["juantap.info", "localhost"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "juantap.info",
        pathname: "/avatars/**",
      },
      {
        protocol: "https",
        hostname: "juantap.info",
        pathname: "/defaults/**",
      },
      {
        protocol: "https",
        hostname: "juantap.info",
        pathname: "/storage/**",
      },
    ],
  },
}

export default nextConfig
