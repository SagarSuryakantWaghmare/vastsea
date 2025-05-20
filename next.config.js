/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support middleware
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [], // Add any remote image patterns here if needed
  },
};

module.exports = nextConfig;
