/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configured for production deployment with Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [], // Add any remote image patterns here if needed
  },
  // Disable features that may cause permission issues on Windows
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  
  // Configuration to handle permission issues
  generateEtags: false,
  
  // Build configuration
  output: 'standalone', // Creates a standalone build that can be deployed without Node.js
  
  // Disable trace output that causes EPERM errors
  experimental: {
    // Disable tracing to avoid permission issues
    disableOptimizedLoading: true,
    optimizeCss: false,
  },
};

module.exports = nextConfig;
