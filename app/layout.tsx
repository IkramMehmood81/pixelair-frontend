import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

// ─── Sitewide metadata ────────────────────────────────────────────────────────
// title.template applies to all child pages automatically:
// e.g. about/page.tsx exports title:"About Us" → renders as "About Us | PhotoGenerator.ai"
export const metadata: Metadata = {
  metadataBase: new URL('https://photogenerator.ai'),
  title: {
    default: 'AI Image Enhancer — Free Photo Enhancer Online | PhotoGenerator.ai',
    template: '%s | PhotoGenerator.ai',
  },
  description:
    'Free AI image enhancer & photo upscaler online. Enhance image quality, restore old photos, and boost resolution with AI. No sign-up. 100% free. Results in seconds.',
  keywords: [
    'AI image enhancer',
    'photo enhancer online',
    'image upscaler free',
    'AI photo enhancer HD',
    'restore old photos AI',
    'increase image resolution online',
    'face enhancement AI',
    'image quality enhancer',
    'enhance photo quality',
    'upscale image online free',
    'AI photo restoration',
    'sharpen blurry photos online',
    'image resolution enhancer',
    'photo clarity enhancer',
    'free image upscaler',
    'online photo quality improvement',
  ],
  authors:   [{ name: 'PhotoGenerator.ai' }],
  creator:   'PhotoGenerator.ai',
  publisher: 'PhotoGenerator.ai',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png',  media: '(prefers-color-scheme: dark)'  },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title:       'AI Image Enhancer — Free Photo Enhancer Online | PhotoGenerator.ai',
    description: 'Enhance image quality instantly with AI. Upscale photos, restore old pictures, and sharpen blurry images — 100% free, no sign-up required.',
    type:        'website',
    url:         'https://photogenerator.ai',
    siteName:    'PhotoGenerator.ai',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'PhotoGenerator.ai — Free AI Image Enhancer and Photo Upscaler Online',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Free AI Image Enhancer & Photo Upscaler | PhotoGenerator.ai',
    description: 'Enhance, upscale, and restore your photos with AI. Free, instant, no sign-up.',
    images:      ['/og-image.png'],
    creator:     '@photogeneratorai',
    site:        '@photogeneratorai',
  },
  alternates: {
    canonical: 'https://photogenerator.ai',
  },
  category: 'technology',
}

// ─── Sitewide JSON-LD ─────────────────────────────────────────────────────────
// Only Organisation + WebApplication + WebSite go here (they apply everywhere).
// FAQPage schema lives in contact/page.tsx where the actual FAQ is rendered.
// Blog Article schema lives in blog/[slug]/page.tsx.
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    // WebApplication — triggers star ratings & feature list in search
    {
      '@type':               'WebApplication',
      '@id':                 'https://photogenerator.ai/#webapp',
      name:                  'PhotoGenerator.ai — AI Image Enhancer',
      url:                   'https://photogenerator.ai',
      description:           'Free AI-powered image enhancer. Upscale photos, restore old images, enhance face details, and improve photo quality online.',
      applicationCategory:   'PhotoEditorApplication',
      operatingSystem:       'Web',
      offers: {
        '@type':        'Offer',
        price:          '0',
        priceCurrency:  'USD',
        availability:   'https://schema.org/InStock',
      },
      featureList: [
        'AI Image Enhancement',
        'Photo Upscaling 2x and 4x',
        'Face Enhancement with CodeFormer AI',
        'Old Photo Restoration',
        'Noise Reduction',
        'Sharpness Improvement',
        'Free to Use',
        'No Sign-up Required',
      ],
      screenshot: 'https://photogenerator.ai/og-image.png',
      aggregateRating: {
        '@type':       'AggregateRating',
        ratingValue:   '4.9',
        reviewCount:   '2847',
        bestRating:    '5',
        worstRating:   '1',
      },
    },
    // Organization
    {
      '@type': 'Organization',
      '@id':   'https://photogenerator.ai/#org',
      name:    'PhotoGenerator.ai',
      url:     'https://photogenerator.ai',
      logo: {
        '@type': 'ImageObject',
        url:     'https://photogenerator.ai/logo-large.png',
      },
      contactPoint: {
        '@type':       'ContactPoint',
        email:         'support@photogenerator.ai',
        contactType:   'customer support',
      },
    },
    // WebSite — enables Google sitelink search box
    {
      '@type':       'WebSite',
      '@id':         'https://photogenerator.ai/#website',
      url:           'https://photogenerator.ai',
      name:          'PhotoGenerator.ai',
      description:   'Free AI Image Enhancer and Photo Upscaler Online',
      potentialAction: {
        '@type':       'SearchAction',
        target:        'https://photogenerator.ai/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Sitewide structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />

        {/* Google AdSense — afterInteractive keeps DOM stable for Auto Ads.
            Avoids CLS and ensures ad containers persist across state changes. */}
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3975156964183803"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />

        {/* Font preconnect reduces TTFB for Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Inter:wght@100..900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />

        {/* Mobile / PWA */}
        <meta name="theme-color"                        content="#000000" />
        <meta name="mobile-web-app-capable"             content="yes" />
        <meta name="apple-mobile-web-app-capable"       content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title"         content="PhotoGenerator.ai" />
      </head>
      <body
        className="font-sans antialiased bg-background text-foreground"
        suppressHydrationWarning
      >
        {children}
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}
