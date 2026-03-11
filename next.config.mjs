/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pixelair-backend.onrender.com',
      },
      {
        protocol: 'https',
        hostname: '**.replicate.delivery',
      },
      {
        protocol: 'https',
        hostname: '**.r2.cloudflarestorage.com',
      },
    ],
  },
}

export default nextConfig
