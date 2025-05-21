/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configured for production deployment with Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [], // Add any remote image patterns here if needed
  },
  // Metadata configuration for Next.js 15
  metadata: {
    metadataBase: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  // Improved production performance settings
  productionBrowserSourceMaps: false,
  swcMinify: true,
};

module.exports = nextConfig;
