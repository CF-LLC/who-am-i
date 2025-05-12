/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // Enable static exports for GitHub Pages
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true, // Required for static export
  },
  // Configure basePath for your repository name
  basePath: '/who-am-i',
  
  // Disable trailing slashes for GitHub Pages compatibility
  trailingSlash: false,
};

export default nextConfig;
