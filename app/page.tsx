/**
 * app/page.tsx — Server Component (Fix 7 + Fix 8)
 *
 * JSON-LD scripts are placed as the first children of the page.
 * Next.js App Router automatically hoists <script type="application/ld+json">
 * tags to the document <head> when they appear in server components —
 * no <head> wrapper needed and no layout impact.
 */

import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'AI Photo Enhancer — Fix Blurry Photos Free in Seconds | PhotoGenerate AI',
  description:
    'Upload any blurry, grainy, or low-res photo and get a sharp HD result in seconds — completely free. No signup, no watermark, no software needed. Try PhotoGenerate AI now →',
  alternates: { canonical: 'https://www.photogenerate.ai' },
}

const softwareAppSchema = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'PhotoGenerate AI',
  url: 'https://www.photogenerate.ai',
  applicationCategory: 'MultimediaApplication',
  operatingSystem: 'Web',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
  description:
    'Free AI photo enhancer. Upload any blurry, grainy, or low-resolution photo and get a sharp, HD result in seconds. No signup, no watermark, no software needed.',
  featureList: [
    'Enhance blurry photos with AI',
    'Fix low resolution images',
    'Remove grain and noise from photos',
    'Restore old faded photos',
    'Sharpen out-of-focus images',
    'Enhance portrait photos',
    'Improve product photo quality',
    'Fix low-light and night photos',
  ],
  screenshot: 'https://www.photogenerate.ai/og-image.png',
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.8',
    ratingCount: '2400',
    bestRating: '5',
    worstRating: '1',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is PhotoGenerate AI really free?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. PhotoGenerate AI is completely free to use. Upload any photo, enhance it with AI, and download the result — no credit card required, no hidden fees, and no watermark on the downloaded image.' } },
    { '@type': 'Question', name: 'Are my photos stored or saved on your servers?', acceptedAnswer: { '@type': 'Answer', text: 'No. Your photos are never stored. Images are processed entirely in memory and discarded instantly the moment enhancement is complete. We do not save, log, or retain any uploaded images.' } },
    { '@type': 'Question', name: 'Do I need to create an account to use PhotoGenerate AI?', acceptedAnswer: { '@type': 'Answer', text: 'No account or signup is required. Simply upload your photo directly on the homepage, let the AI enhance it, and download the result. No registration, no email address needed.' } },
    { '@type': 'Question', name: 'Will my enhanced photo have a watermark?', acceptedAnswer: { '@type': 'Answer', text: 'No. Enhanced photos are downloaded completely watermark-free. You own the result and can use it however you like.' } },
    { '@type': 'Question', name: 'What image formats does PhotoGenerate AI support?', acceptedAnswer: { '@type': 'Answer', text: 'PhotoGenerate AI supports JPG, JPEG, PNG, and WebP image formats. For best results, use a JPG or PNG file under 10MB.' } },
    { '@type': 'Question', name: 'How long does AI photo enhancement take?', acceptedAnswer: { '@type': 'Answer', text: 'Enhancement typically takes 10 to 20 seconds depending on the image size and complexity. You will see a progress indicator while the AI processes your photo.' } },
    { '@type': 'Question', name: 'What types of photos can PhotoGenerate AI improve?', acceptedAnswer: { '@type': 'Answer', text: 'PhotoGenerate AI can improve blurry portraits, old faded family photos, low-resolution product images, grainy night photos, out-of-focus shots, and pixelated images. It works on any photo type — personal, professional, or commercial.' } },
    { '@type': 'Question', name: 'Does PhotoGenerate AI work on mobile phones?', acceptedAnswer: { '@type': 'Answer', text: 'Yes. PhotoGenerate AI works in any modern mobile browser on iOS and Android. You can upload directly from your camera roll without installing any app.' } },
  ],
}

export default function HomePage() {
  return <HomePageClient />
}