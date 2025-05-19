/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to support middleware
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
