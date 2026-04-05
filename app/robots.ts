import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/_next/'],
      },
    ],
    sitemap: 'https://www.photogenerate.ai/sitemap.xml', // ✅ correct domain
    host: 'https://www.photogenerate.ai',                // ✅ correct domain
  }
}