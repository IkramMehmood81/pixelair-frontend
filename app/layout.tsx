import './globals.css'
import type { Metadata } from 'next'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { CookieConsent } from '@/components/cookie-consent'
import AdSenseLoader from '@/components/adsense-loader'

// ── Replace GA_MEASUREMENT_ID with your real GA4 ID (e.g. G-XXXXXXXXXX) ──────
const GA_ID = process.env.NEXT_PUBLIC_GA_ID || ''

export const metadata: Metadata = {
  metadataBase: new URL('https://photogenerate.ai'),
  title: {
    default: 'AI Photo Enhancer — Fix Blurry Photos Free in Seconds | PhotoGenerate.ai',
    template: '%s | PhotoGenerate.ai',
  },
  description:
    'Upload any blurry, grainy, or low-res photo and get a sharp HD result in seconds — completely free. No signup, no watermark, no software needed. Try PhotoGenerate.ai now →',
  keywords: [
    'AI image enhancer','photo enhancer online','image upscaler free',
    'AI photo enhancer HD','restore old photos AI','increase image resolution online',
    'face enhancement AI','image quality enhancer','enhance photo quality',
    'upscale image online free','AI photo restoration','sharpen blurry photos online',
    'image resolution enhancer','photo clarity enhancer','free image upscaler',
    'online photo quality improvement','free ai upscaler','ai enhancement tools',
    'photo restoration ai','ai image upscale','better quality image online',
    'restore photos online free','ai image restoration','enhance old photos free',
    'sharpen old images free','online photo upscaler tool','restore blurry images ai',
    'increase image resolution ai','free picture quality enhancer','improve photo quality online',
  ],
  authors:   [{ name: 'PhotoGenerate.ai' }],
  creator:   'PhotoGenerate.ai',
  publisher: 'PhotoGenerate.ai',
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
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
    title: 'Free AI Image Enhancer — Fix Blurry Photos Online | PhotoGenerate.ai',
    description: 'Fix blurry photos instantly with AI. Sharpen, restore, and upscale images online — no sign-up, no watermarks, completely free.',
    type: 'website', url: 'https://photogenerate.ai', siteName: 'PhotoGenerate.ai',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'PhotoGenerate.ai — Free AI Image Enhancer' }],
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free AI Image Enhancer — Fix Blurry Photos Instantly | PhotoGenerate.ai',
    description: 'Fix blurry photos, restore old pictures, and upscale image resolution with AI. Free, instant, no sign-up.',
    images: ['/og-image.png'], creator: '@photogenerateai', site: '@photogenerateai',
  },
  alternates: { canonical: 'https://photogenerate.ai' },
  category: 'technology',
}

// ── Structured data — aggregateRating REMOVED (no verified review system) ─────
const structuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': 'https://photogenerate.ai/#webapp',
      name: 'PhotoGenerate.ai — Free AI Image Enhancer',
      url: 'https://photogenerate.ai',
      description: 'Fix blurry photos, sharpen low-quality images, restore old photos, and upscale image resolution online — free, no sign-up required.',
      applicationCategory: 'PhotoEditorApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD', availability: 'https://schema.org/InStock' },
      featureList: ['AI Image Enhancement','Photo Upscaling 2x and 4x','Face Enhancement with CodeFormer AI','Old Photo Restoration','Noise Reduction','Sharpness Improvement','Free to Use','No Sign-up Required'],
      screenshot: 'https://photogenerate.ai/og-image.png',
    },
    {
      '@type': 'Organization',
      '@id': 'https://photogenerate.ai/#org',
      name: 'PhotoGenerate.ai',
      url: 'https://photogenerate.ai',
      logo: { '@type': 'ImageObject', url: 'https://photogenerate.ai/logo-large.png' },
      contactPoint: { '@type': 'ContactPoint', email: 'support@photogenerate.ai', contactType: 'customer support' },
    },
    {
      '@type': 'WebSite',
      '@id': 'https://photogenerate.ai/#website',
      url: 'https://photogenerate.ai',
      name: 'PhotoGenerate.ai',
      description: 'Free AI Image Enhancer and Photo Upscaler Online',
      potentialAction: { '@type': 'SearchAction', target: 'https://photogenerate.ai/blog?q={search_term_string}', 'query-input': 'required name=search_term_string' },
    },
  ],
}

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PhotoGenerate.ai',
  url: 'https://www.photogenerate.ai',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description: 'Free AI photo enhancer. Upload any blurry, grainy, or low-resolution photo and get a sharp, HD result in seconds.',
  featureList: ['Enhance blurry photos with AI','Fix low resolution images','Remove grain and noise from photos','Restore old faded photos','Sharpen out-of-focus images','Enhance portrait photos','Improve product photo quality','Fix low-light and night photos'],
  screenshot: 'https://www.photogenerate.ai/og-image.png',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <head>
        <meta name="google-site-verification" content="jQC2z7fcWhNoU-_Bj7NlhIcjYTREyoVsChhFQo0H-xQ" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }} />
        {/* Google Analytics 4 — only loads if GA_ID is set in .env.local */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}', { page_path: window.location.pathname });
              `}
            </Script>
          </>
        )}

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Inter:wght@100..900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="PhotoGenerate.ai" />
      </head>
      <body className="font-sans antialiased bg-background text-foreground" suppressHydrationWarning>
        {children}
        <CookieConsent />
        <AdSenseLoader publisherId="ca-pub-3975156964183803" />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}