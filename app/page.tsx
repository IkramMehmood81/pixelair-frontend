'use client'

import { useState, useCallback } from 'react'
import { Zap, Shield, Wand2, Download, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { UploadZone } from '@/components/upload-zone'
import { FeatureCard } from '@/components/feature-card'
import { StatCard } from '@/components/stat-card'
import { GradientSection } from '@/components/gradient-section'
import { CTASection } from '@/components/cta-section'
import { Step } from '@/components/step'
import { TestimonialCard } from '@/components/testimonial-card'
import { useToast } from '@/hooks/use-toast'

// ─── Constants ────────────────────────────────────────────────────────────────

// 10 MB file-size gate — matches the API route's own limit.
// The canvas compressor (MAX_CANVAS_DIM / CANVAS_QUALITY) further reduces the
// payload before it is stored in sessionStorage, avoiding QuotaExceededError.
const MAX_FILE_SIZE   = 10 * 1024 * 1024
const MAX_CANVAS_DIM  = 1024   // longest edge after compression
const CANVAS_QUALITY  = 0.7    // JPEG quality (0–1)

// ─── Canvas compression helper ────────────────────────────────────────────────

/**
 * Compress an image File using Canvas:
 *  - Downscale so longest edge ≤ MAX_CANVAS_DIM (never upscales)
 *  - Re-encode as JPEG at CANVAS_QUALITY
 * Returns a compact base64 data-URI safe for sessionStorage.
 *
 * Falls back to a plain FileReader data-URI if Canvas is unavailable,
 * which preserves the original flow rather than crashing.
 */
async function compressImageToDataURL(file: File): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const originalDataUrl = reader.result as string
      const img = new Image()
      img.onload = () => {
        let { width, height } = img

        // Only downscale — never upscale at the compression step.
        if (width > MAX_CANVAS_DIM || height > MAX_CANVAS_DIM) {
          const ratio = Math.min(MAX_CANVAS_DIM / width, MAX_CANVAS_DIM / height)
          width  = Math.round(width  * ratio)
          height = Math.round(height * ratio)
        }

        const canvas = document.createElement('canvas')
        canvas.width  = width
        canvas.height = height
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          // Canvas unavailable — fall back to original data-URI.
          resolve(originalDataUrl)
          return
        }

        ctx.drawImage(img, 0, 0, width, height)
        const compressed = canvas.toDataURL('image/jpeg', CANVAS_QUALITY)

        // Free canvas memory immediately after encoding.
        canvas.width  = 0
        canvas.height = 0

        resolve(compressed)
      }
      img.onerror = () => resolve(originalDataUrl) // graceful fallback
      img.src = originalDataUrl
    }
    reader.readAsDataURL(file)
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [uploadedFile, setUploadedFile]   = useState<File | null>(null)
  const [preview,      setPreview]        = useState<string>('')
  const [enhanceScale, setEnhanceScale]   = useState<'2x' | '4x'>('2x')
  const [faceEnhance,  setFaceEnhance]    = useState(false)
  const [isProcessing, setIsProcessing]   = useState(false)
  const { toast } = useToast()

  // ── File selection ──────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File | null) => {
    if (file === null) {
      setUploadedFile(null)
      setPreview('')
      return
    }

    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Please upload an image under 10 MB.',
        variant: 'destructive',
      })
      return
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a PNG, JPG, or WebP image.',
        variant: 'destructive',
      })
      return
    }

    setUploadedFile(file)

    // Generate a lightweight Object-URL just for the <img> preview.
    // This never hits sessionStorage and is revoked automatically by the browser.
    setPreview(URL.createObjectURL(file))
  }, [toast])

  // ── Enhance: compress → sessionStorage → navigate ──────────────────────────
  const handleEnhance = async () => {
    if (!uploadedFile || isProcessing) return
    setIsProcessing(true)

    try {
      // Compress the image in-browser before storing.
      // Resulting JPEG at 1024 px / quality 0.7 is typically 50–200 KB,
      // well within the ~5 MB sessionStorage quota.
      const compressedDataUrl = await compressImageToDataURL(uploadedFile)

      try {
        sessionStorage.setItem('originalImage', compressedDataUrl)
        sessionStorage.setItem('enhanceScale',  enhanceScale)
        sessionStorage.setItem('faceEnhance',   String(faceEnhance))
      } catch (quotaErr) {
        // sessionStorage quota exceeded (can happen on very low-memory devices).
        // Notify the user and abort rather than navigate with no data.
        console.error('sessionStorage quota exceeded:', quotaErr)
        toast({
          title: 'Storage error',
          description: 'Could not store the image. Try a smaller image or clear your browser storage.',
          variant: 'destructive',
        })
        setIsProcessing(false)
        return
      }

      window.location.href = '/enhance'
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to process image. Please try again.',
        variant: 'destructive',
      })
      setIsProcessing(false)
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero Section ───────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-center justify-center py-10 sm:py-14 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-10 xs:top-16 sm:top-20 right-0 xs:right-10 w-48 xs:w-56 sm:w-72 h-48 xs:h-56 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
          </div>

          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center space-y-5 xs:space-y-6 sm:space-y-7">

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium tracking-tight text-primary hover:border-primary/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span className="truncate xs:truncate-none">AI-Powered Image Enhancement</span>
              </div>

              {/* Headline */}
              <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance text-foreground leading-tight">
                  Transform Your
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Photos Instantly
                  </span>
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0">
                  Professional-grade image enhancement powered by advanced AI. No sign-up required. Completely free. Your privacy is guaranteed.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 xs:gap-4 pt-2 px-2 xs:px-0">
                <Button
                  asChild
                  size="lg"
                  className="px-6 xs:px-8 py-5 xs:py-6 text-sm xs:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="#upload" className="flex items-center justify-center xs:justify-start gap-3" aria-label="Start enhancing your photos">
                    Start Enhancing
                    <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="px-6 xs:px-8 py-5 xs:py-6 text-sm xs:text-base font-semibold border-border hover:border-primary/40 hover:bg-primary/5 transition-all duration-200"
                >
                  <Link href="#how-it-works">See How It Works</Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard value="500K+" label="Enhanced"  highlight />
                <StatCard value="100%"  label="Free" />
                <StatCard value="2s"    label="Average" />
                <StatCard value="∞"     label="No Limits" />
              </div>

            </div>
          </div>
        </section>

        {/* ── Upload Section ─────────────────────────────────────────────── */}
        <GradientSection id="upload">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                Upload Your Image
              </h2>
              <p className="text-muted-foreground text-lg font-light">
                Drag and drop or select a file to begin enhancement
              </p>
            </div>

            <UploadZone
              onFileSelect={handleFileSelect}
              selectedFile={uploadedFile}
              preview={preview}
            />

            {uploadedFile && (
              <div className="mt-8 space-y-4">

                {/* Enhancement Settings */}
                <div className="p-6 rounded-lg border border-border bg-card">
                  <h3 className="font-semibold text-foreground mb-4">Enhancement Settings</h3>
                  <div className="grid sm:grid-cols-2 gap-6">

                    {/* ── Upscale Factor ──────────────────────────────────────────
                      iOS Safari fix: <button onClick> with animated/transformed
                      children silently drops tap events on GPU-composited layers.
                      Solution: visually-hidden <input type="radio"> inside a <label>.
                      iOS Safari guarantees onChange fires on native label→input pairs.
                      pointer-events:none on the text child ensures the <label> is
                      always the touch target, never the child span.
                    ─────────────────────────────────────────────────────────────── */}
                    <div className="space-y-3">
                      <span className="text-sm font-medium text-foreground">Upscale Factor</span>
                      <div className="flex gap-2" role="radiogroup" aria-label="Upscale factor selection">
                        {(['2x', '4x'] as const).map((scale) => (
                          <label
                            key={scale}
                            className={[
                              'relative px-4 py-2 rounded-lg font-medium cursor-pointer select-none transition-colors',
                              enhanceScale === scale
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-background hover:border-primary text-foreground',
                            ].join(' ')}
                          >
                            {/*
                              sr-only: visually hidden but present in accessibility tree.
                              onChange (not onClick): fires reliably on all browsers
                              including iOS Safari without the 300 ms tap-delay issue.
                            */}
                            <input
                              type="radio"
                              name="upscale-factor"
                              value={scale}
                              checked={enhanceScale === scale}
                              onChange={() => setEnhanceScale(scale)}
                              className="sr-only"
                              aria-label={`Upscale ${scale}`}
                            />
                            {/* pointer-events-none: tap always targets the <label> */}
                            <span className="pointer-events-none">{scale}</span>
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">2x is much faster than 4x</p>
                    </div>

                    {/* ── Face Enhancement Toggle ─────────────────────────────────
                      iOS Safari fix: the original <button> had a GPU-composited
                      <span> thumb (transition-transform + transform) that intercepted
                      taps before they reached the button's onClick handler.
                      Solution: <label> wraps a hidden <input type="checkbox"> and the
                      visual track+thumb. pointer-events:none on both the track <div>
                      and the thumb <span> guarantee the tap always reaches the <label>.
                      e.target.checked reads native input state directly — no inversion
                      logic that can desync under rapid taps.
                    ─────────────────────────────────────────────────────────────── */}
                    <div className="space-y-3">
                      <span className="text-sm font-medium text-foreground">Face Enhancement</span>
                      <div className="flex items-center gap-3">
                        <label
                          aria-label={`Face enhancement ${faceEnhance ? 'enabled' : 'disabled'}`}
                          className="cursor-pointer"
                        >
                          {/*
                            Visually hidden checkbox — present in a11y tree.
                            onChange fires reliably on iOS Safari; onClick on a
                            custom <button> does not.
                          */}
                          <input
                            type="checkbox"
                            checked={faceEnhance}
                            onChange={(e) => setFaceEnhance(e.target.checked)}
                            className="sr-only"
                          />
                          {/* Visual track — pointer-events-none so tap reaches <label> */}
                          <div
                            className={[
                              'relative inline-flex h-8 w-14 items-center rounded-full transition-colors pointer-events-none',
                              faceEnhance ? 'bg-primary' : 'bg-border',
                            ].join(' ')}
                          >
                            {/* Sliding thumb — pointer-events-none for same reason */}
                            <span
                              className={[
                                'inline-block h-6 w-6 transform rounded-full bg-white transition-transform pointer-events-none',
                                faceEnhance ? 'translate-x-7' : 'translate-x-1',
                              ].join(' ')}
                            />
                          </div>
                        </label>
                        <span className="text-sm text-muted-foreground">
                          {faceEnhance ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="mt-4 p-3 rounded-lg bg-accent/10 text-sm text-muted-foreground">
                    Processing time depends on image size and scale. 2x is much faster than 4x.
                  </div>
                </div>

                {/* Enhance / Clear buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleEnhance}
                    disabled={isProcessing}
                    size="lg"
                    className="flex-1 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-60"
                    aria-label="Enhance the uploaded image"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    {isProcessing ? 'Preparing…' : 'Enhance Image'}
                  </Button>
                  <Button
                    onClick={() => handleFileSelect(null)}
                    disabled={isProcessing}
                    variant="outline"
                    size="lg"
                    className="px-6"
                    aria-label="Clear the selected image"
                  >
                    Clear
                  </Button>
                </div>

              </div>
            )}
          </div>
        </GradientSection>

        {/* ── Features ───────────────────────────────────────────────────── */}
        <GradientSection id="features">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Why Choose PhotoGenerator.ai
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Built for creators who demand quality and simplicity
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
              <FeatureCard icon={Zap}      title="Lightning Fast"  description="Enhanced images in seconds. Optimised for speed without sacrificing quality." highlight />
              <FeatureCard icon={Shield}   title="100% Private"    description="Your images are never stored. Complete privacy with automatic deletion." />
              <FeatureCard icon={Wand2}    title="AI-Powered"      description="State-of-the-art algorithms deliver professional-grade results." />
              <FeatureCard icon={Download} title="Unlimited"       description="No watermarks, no limits, no premium tier. Completely free." />
            </div>
          </div>
        </GradientSection>

        {/* ── How It Works ───────────────────────────────────────────────── */}
        <GradientSection id="how-it-works">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Simple Three-Step Process
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light">
                Quality enhancement made effortless
              </p>
            </div>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 max-w-3xl mx-auto">
              <Step number={1} title="Upload Your Image"           description="Select or drag-and-drop any image. We support PNG, JPG, and WebP formats up to 10MB." />
              <Step number={2} title="AI Analysis &amp; Enhancement" description="Our advanced AI instantly analyses and enhances your image with clarity boost, noise reduction, and colour optimisation." />
              <Step number={3} title="Download &amp; Share"          description="Get your enhanced image immediately. Share directly or download in high quality — no watermarks, no restrictions." />
            </div>
          </div>
        </GradientSection>

        {/* ── Testimonials ───────────────────────────────────────────────── */}
        <GradientSection>
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Trusted by Creators
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Photographers and content creators love PhotoGenerator.ai
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
              <TestimonialCard quote="PhotoGenerator.ai completely transformed my photo workflow. The quality is exceptional and it's truly free."    author="Sarah Chen"       role="Photographer"     rating={5} />
              <TestimonialCard quote="I use it daily. The AI enhancement is spot-on, and there are no hidden paywalls or watermarks."                 author="Marcus Rodriguez" role="Content Creator"   rating={5} />
              <TestimonialCard quote="Finally a tool that respects user privacy while delivering professional results. Highly recommend."             author="Emma Williams"    role="Digital Marketer" rating={5} />
            </div>
          </div>
        </GradientSection>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <CTASection
          title="Ready to Enhance Your Photos?"
          description="Join thousands of creators improving their images with PhotoGenerator.ai. Get started instantly — no sign-up required."
          primaryCTA={{ text: 'Start Enhancing', href: '#upload' }}
          secondaryCTA={{ text: 'Learn More',    href: '#how-it-works' }}
        />

      </main>

      <Footer />
    </div>
  )
}
