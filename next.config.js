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
  
  // Improved HTTP handling
  httpAgentOptions: {
    keepAlive: true,
  },
  
  // Add proper headers to API responses
  async headers() {
    return [
      {
        // Apply these headers to API routes
        source: '/api/:path*',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json; charset=utf-8'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, max-age=0, must-revalidate'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          }
        ]
      }
    ];
  },
  
  // Disable trace output that causes EPERM errors
  experimental: {
    // Disable tracing to avoid permission issues
    disableOptimizedLoading: true,
    optimizeCss: false,
  },
};

module.exports = nextConfig;
