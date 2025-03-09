/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverActions: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'smartmontools'];
    return config;
  }
}

module.exports = nextConfig 