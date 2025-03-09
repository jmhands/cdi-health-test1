/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'smartmontools'];
    return config;
  }
}

module.exports = nextConfig 