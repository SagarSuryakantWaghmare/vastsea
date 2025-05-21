/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configured for production deployment with Next.js 15
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [], // Add any remote image patterns here if needed
  },
  // Next.js 15 no longer needs the metadata experimental flag
  // And swcMinify is enabled by default
  productionBrowserSourceMaps: false,
  // Disable tracing to avoid permission issues on Windows
  output: 'standalone',
  // Set the distDir to a custom directory to avoid permission issues
  distDir: 'build',
  generateBuildId: async () => {
    return `build-${new Date().getTime()}`;
  },
};

module.exports = nextConfig;
