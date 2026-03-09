import type { Metadata } from 'next'
import { Geist, Geist_Mono, Inter, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const geist = Geist({ subsets: ["latin"], variable: '--font-sans' });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: '--font-mono' });
const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair', weight: ['400', '500', '600', '700', '800', '900'] });

export const metadata: Metadata = {
  title: 'ProEnhance - AI Image Enhancer | Enhance Your Photos for Free',
  description: 'Free AI-powered image enhancer. Improve your photos with one click. Enhance clarity, reduce noise, improve colors, and upscale images. No signup required.',
  generator: 'v0.app',
  keywords: 'image enhancer, photo enhancer, AI image, online image editor, photo improvement',
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
    title: 'ProEnhance - AI Image Enhancer',
    description: 'Free AI-powered image enhancer. Improve your photos with one click.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${geist.variable} ${geistMono.variable} ${inter.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
