/**
 * app/page.tsx — Home page (Server Component)
 *
 * Kept lean — all UI is in HomePageClient.
 * FAQPage schema lives here because the FAQ content renders here.
 * aggregateRating REMOVED — no verified review system on site.
 */

import type { Metadata } from 'next'
import HomePageClient from '@/components/HomePageClient'

export const metadata: Metadata = {
  title: 'AI Photo Enhancer — Fix Blurry Photos Free in Seconds | PhotoGenerator.ai',
  description:
    'Upload any blurry, grainy, or low-res photo and get a sharp HD result in seconds — completely free. No signup, no watermark, no software needed. Try PhotoGenerator.ai now →',
  alternates: { canonical: 'https://www.photogenerator.ai' },
}

// FAQPage schema — matches the FAQ rendered in HomePageClient
const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Is PhotoGenerator.ai really free?',             acceptedAnswer: { '@type': 'Answer', text: 'Yes. Completely free — no credit card, no hidden fees, no watermark on your download.' } },
    { '@type': 'Question', name: 'Are my photos stored on your servers?',          acceptedAnswer: { '@type': 'Answer', text: 'No. Images are processed in memory and discarded instantly. We never store or retain any uploaded photos.' } },
    { '@type': 'Question', name: 'Do I need an account to use PhotoGenerator.ai?', acceptedAnswer: { '@type': 'Answer', text: 'No account or signup needed. Upload your photo, enhance it, and download the result.' } },
    { '@type': 'Question', name: 'Will my enhanced photo have a watermark?',       acceptedAnswer: { '@type': 'Answer', text: 'No. Enhanced photos download completely watermark-free.' } },
    { '@type': 'Question', name: 'What image formats are supported?',              acceptedAnswer: { '@type': 'Answer', text: 'JPG, JPEG, PNG, and WebP. For best results use JPG or PNG under 10MB.' } },
    { '@type': 'Question', name: 'How long does enhancement take?',                acceptedAnswer: { '@type': 'Answer', text: 'Typically 10 to 20 seconds depending on image size and complexity.' } },
    { '@type': 'Question', name: 'What types of photos can it improve?',           acceptedAnswer: { '@type': 'Answer', text: 'Blurry portraits, old faded photos, low-resolution product images, grainy night photos, out-of-focus shots, and pixelated images.' } },
    { '@type': 'Question', name: 'Does PhotoGenerator.ai work on mobile phones?',  acceptedAnswer: { '@type': 'Answer', text: 'Yes — works in any modern mobile browser on iOS and Android. No app needed.' } },
  ],
}

export default function HomePage() {
  return (
    <>
      {/* FAQPage JSON-LD — must be on same page as the visible FAQ content */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomePageClient />
    </>
  )
}