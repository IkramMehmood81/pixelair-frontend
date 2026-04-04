import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'

// ─── Sitewide metadata ────────────────────────────────────────────────────────
// title.template applies to all child pages automatically:
// e.g. about/page.tsx exports title:"About Us" → renders as "About Us | PhotoGenerate AI"
export const metadata: Metadata = {
  metadataBase: new URL('https://photogenerate.ai'),
  title: {
    default: 'AI Photo Enhancer — Fix Blurry Photos Free in Seconds | PhotoGenerate AI',
    template: '%s | PhotoGenerate AI',
  },
  description:
    'Upload any blurry, grainy, or low-res photo and get a sharp HD result in seconds — completely free. No signup, no watermark, no software needed. Try PhotoGenerate AI now →',
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
    "free ai upscaler",
    "ai enhancement tools",
    "photo restoration ai",
    "old photo correction software",
    "ai image upscale",
    "better quality image online",
    "restore photos online free",
    "clear old photos software",
    "ai image restoration",
    "enhance old photos free",
    "photo detail enhancer",
    "sharpen old images free",
    "online photo upscaler tool",
    "restore blurry images ai",
    "ai automatic photo editing",
    "increase image resolution ai",
    "free picture quality enhancer",
    "ai fix old photos",
    "improve photo quality online",
    "best ai upscaler tool"

  ],
  authors:   [{ name: 'PhotoGenerate AI' }],
  creator:   'PhotoGenerate AI',
  publisher: 'PhotoGenerate AI',
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
    title:       'Free AI Image Enhancer — Fix Blurry Photos Online | PhotoGenerate AI',
    description: 'Fix blurry photos instantly with AI. Sharpen, restore, and upscale images online — no sign-up, no watermarks, completely free.',
    type:        'website',
    url:         'https://photogenerate.ai',
    siteName:    'PhotoGenerate AI',
    images: [
      {
        url:    '/og-image.png',
        width:  1200,
        height: 630,
        alt:    'PhotoGenerate AI — Free AI Image Enhancer and Photo Upscaler Online',
      },
    ],
    locale: 'en_US',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Free AI Image Enhancer — Fix Blurry Photos Instantly | PhotoGenerate AI',
    description: 'Fix blurry photos, restore old pictures, and upscale image resolution with AI. Free, instant, no sign-up.',
    images:      ['/og-image.png'],
    creator:     '@photogenerateai',
    site:        '@photogenerateai',
  },
  alternates: {
    canonical: 'https://photogenerate.ai',
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
      '@id':                 'https://photogenerate.ai/#webapp',
      name:                  'PhotoGenerate AI — Free AI Image Enhancer',
      url:                   'https://photogenerate.ai',
      description:           'Fix blurry photos, sharpen low-quality images, restore old photos, and upscale image resolution online — free, no sign-up required.',
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
      screenshot: 'https://photogenerate.ai/og-image.png',
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
      '@id':   'https://photogenerate.ai/#org',
      name:    'PhotoGenerate AI',
      url:     'https://photogenerate.ai',
      logo: {
        '@type': 'ImageObject',
        url:     'https://photogenerate.ai/logo-large.png',
      },
      contactPoint: {
        '@type':       'ContactPoint',
        email:         'support@photogenerate.ai',
        contactType:   'customer support',
      },
    },
    // WebSite — enables Google sitelink search box
    {
      '@type':       'WebSite',
      '@id':         'https://photogenerate.ai/#website',
      url:           'https://photogenerate.ai',
      name:          'PhotoGenerate AI',
      description:   'Free AI Image Enhancer and Photo Upscaler Online',
      potentialAction: {
        '@type':       'SearchAction',
        target:        'https://photogenerate.ai/blog?q={search_term_string}',
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

// ── Homepage-specific schemas (SoftwareApplication + FAQPage) ─────────────────
// Placed in layout so they render in <head> server-side with zero hydration risk.
const homepageSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'PhotoGenerate AI',
    url: 'https://www.photogenerate.ai',
    applicationCategory: 'MultimediaApplication',
    operatingSystem: 'Web',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    description: 'Free AI photo enhancer. Upload any blurry, grainy, or low-resolution photo and get a sharp, HD result in seconds. No signup, no watermark, no software needed.',
    featureList: [
      'Enhance blurry photos with AI', 'Fix low resolution images',
      'Remove grain and noise from photos', 'Restore old faded photos',
      'Sharpen out-of-focus images', 'Enhance portrait photos',
      'Improve product photo quality', 'Fix low-light and night photos',
    ],
    screenshot: 'https://www.photogenerate.ai/og-image.png',
    aggregateRating: { '@type': 'AggregateRating', ratingValue: '4.8', ratingCount: '2400', bestRating: '5', worstRating: '1' },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      { '@type': 'Question', name: 'Is PhotoGenerate AI really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. Completely free — no credit card, no hidden fees, no watermark on your download.' } },
      { '@type': 'Question', name: 'Are my photos stored on your servers?', acceptedAnswer: { '@type': 'Answer', text: 'No. Images are processed in memory and discarded instantly. We never store or retain any uploaded photos.' } },
      { '@type': 'Question', name: 'Do I need an account to use PhotoGenerate AI?', acceptedAnswer: { '@type': 'Answer', text: 'No account or signup needed. Upload your photo, enhance it, and download the result.' } },
      { '@type': 'Question', name: 'Will my enhanced photo have a watermark?', acceptedAnswer: { '@type': 'Answer', text: 'No. Enhanced photos download completely watermark-free.' } },
      { '@type': 'Question', name: 'What image formats are supported?', acceptedAnswer: { '@type': 'Answer', text: 'JPG, JPEG, PNG, and WebP. For best results use JPG or PNG under 10MB.' } },
      { '@type': 'Question', name: 'How long does enhancement take?', acceptedAnswer: { '@type': 'Answer', text: 'Typically 10 to 20 seconds depending on image size and complexity.' } },
      { '@type': 'Question', name: 'What types of photos can it improve?', acceptedAnswer: { '@type': 'Answer', text: 'Blurry portraits, old faded photos, low-resolution product images, grainy night photos, out-of-focus shots, and pixelated images.' } },
      { '@type': 'Question', name: 'Does PhotoGenerate AI work on mobile?', acceptedAnswer: { '@type': 'Answer', text: 'Yes — works in any modern mobile browser on iOS and Android. No app needed.' } },
    ],
  },
]

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

        {/* Homepage-specific schemas (SoftwareApplication + FAQPage) */}
        {homepageSchemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}

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
        <meta name="apple-mobile-web-app-title"         content="PhotoGenerate AI" />
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