const nextConfig = {
  reactStrictMode:true,
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint warnings during build
  },
  quiet: true,
  images: {
    domains: ['localhost'], // Replace with the domain from which your images are being served
  },
};

export default nextConfig;
