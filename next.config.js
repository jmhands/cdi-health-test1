/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [];
  },
  webpack: (config) => {
    config.externals = [...(config.externals || []), 'smartmontools'];
    return config;
  },
  // Add hostname configuration
  hostname: '0.0.0.0',
  // Optional: you might also want to specify the port
  port: 3000,
}

module.exports = nextConfig 