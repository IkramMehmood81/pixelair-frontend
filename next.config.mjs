/** @type {import('next').NextConfig} */
const nextConfig = {
  // Compress responses for better performance / LCP
  compress: true,

  images: {
    // Keep unoptimized for Replicate CDN URLs but enable formats
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.onrender.com' },
      { protocol: 'https', hostname: '**.replicate.delivery' },
      { protocol: 'https', hostname: '**.r2.cloudflarestorage.com' },
      { protocol: 'https', hostname: '**.gohighlevel.com' },
      { protocol: 'https', hostname: '**.leadconnectorhq.com' },
      { protocol: 'https', hostname: '**.filesafe.space' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      { protocol: 'https', hostname: '**.googleapis.com' },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' }, // was DENY — SAMEORIGIN allows embeds from same origin
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          // Cache-Control for static assets — improves LCP
          { key: 'Vary', value: 'Accept-Encoding' },
        ],
      },
      // Cache static assets aggressively
      {
        source: '/(.*)\\.(png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache JS/CSS
      {
        source: '/_next/static/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ]
  },

  async rewrites() {
    const apiBase =
      process.env.NEXT_PUBLIC_API_URL ||
      process.env.API_URL ||
      'http://localhost:8000'
    return [
      { source: '/api/enhance',      destination: `${apiBase}/enhance-image` },
      { source: '/api/blogs/:path*', destination: `${apiBase}/blogs/:path*` },
    ]
  },

  // Experimental optimizations — safe and production-ready
  experimental: {
    optimizeCss: true,       // Critters CSS inlining — reduces render-blocking CSS
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
    ],
  },
}

export default nextConfig
