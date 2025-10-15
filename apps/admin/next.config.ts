import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    '@web-extension-accessibility-frontend/ui',
    '@web-extension-accessibility-frontend/api-client',
  ],
  output: 'standalone',
};

export default nextConfig;
