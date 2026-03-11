import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PhotoGenerator.ai — AI-Powered Image Enhancement',
  description: 'AI powered image enhancement. Upscale, sharpen and restore your photos instantly. No sign-up required. Completely free. Your privacy is guaranteed.',
  keywords: 'image enhancer, photo enhancer, AI image, upscale image, photo improvement, image restoration',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'PhotoGenerator.ai — AI-Powered Image Enhancement',
    description: 'AI powered image enhancement. Upscale and restore your photos instantly. No sign-up required.',
    type: 'website',
    siteName: 'PhotoGenerator.ai',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PhotoGenerator.ai — AI-Powered Image Enhancement',
    description: 'AI powered image enhancement. Upscale and restore your photos instantly.',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Geist:wght@100..900&family=Geist+Mono:wght@100..900&family=Inter:wght@100..900&family=Playfair+Display:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
