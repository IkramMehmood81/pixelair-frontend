/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      // Existing — Replicate / enhancement results
      { protocol: 'https', hostname: 'pixelair-backend.onrender.com' },
      { protocol: 'https', hostname: '**.replicate.delivery' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      // GoHighLevel blog images
      { protocol: 'https', hostname: '**.gohighlevel.com' },
      { protocol: 'https', hostname: '**.leadconnectorhq.com' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
      // Generic CDN wildcard (covers most GHL media hosts)
      { protocol: 'https', hostname: '**' },
    ],
  },
  // Needed if deploying backend + frontend on separate origins
  async rewrites() {
    const apiBase = process.env.API_URL || 'http://localhost:8000'
    return [
      {
        source: '/api/blogs/:path*',
        destination: `${apiBase}/blogs/:path*`,
      },
    ]
  },
}

export default nextConfig
