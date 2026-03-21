/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: '**.replicate.delivery' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.gohighlevel.com' },
      { protocol: 'https', hostname: '**.leadconnectorhq.com' },
      { protocol: 'https', hostname: '**.filesafe.space' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      'http://localhost:8000'
    return [
      { source: '/api/enhance', destination: `${apiBase}/enhance-image` },
      { source: '/api/blogs/:path*', destination: `${apiBase}/blogs/:path*` },
    ]
  },
}

export default nextConfig
