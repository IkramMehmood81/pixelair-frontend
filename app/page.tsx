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

const MAX_FILE_SIZE = 5 * 1024 * 1024
const MAX_IMAGE_DIMENSION = 2000

export default function HomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>('')
  const [enhanceScale, setEnhanceScale] = useState('2x')
  const [faceEnhance, setFaceEnhance] = useState(false)
  const { toast } = useToast()

  const resizeImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        let { width, height } = img
        if (width <= MAX_IMAGE_DIMENSION && height <= MAX_IMAGE_DIMENSION) {
          resolve(dataUrl)
          return
        }
        const ratio = Math.min(MAX_IMAGE_DIMENSION / width, MAX_IMAGE_DIMENSION / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height)
          resolve(canvas.toDataURL('image/jpeg', 0.9))
        } else {
          resolve(dataUrl)
        }
      }
      img.src = dataUrl
    })
  }

  const handleFileSelect = useCallback((file: File | null) => {
    if (file === null) {
      setUploadedFile(null)
      setPreview('')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: 'File too large',
        description: 'Image too large. Please upload an image under 5MB for faster processing.',
        variant: 'destructive',
      })
      return
    }
    if (file.type.startsWith('image/')) {
      setUploadedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }, [toast])

  const handleEnhance = async () => {
    if (uploadedFile) {
      try {
        const reader = new FileReader()
        reader.onloadend = async () => {
          const originalDataUrl = reader.result as string
          const resizedDataUrl = await resizeImage(originalDataUrl)
          sessionStorage.setItem('originalImage', resizedDataUrl)
          sessionStorage.setItem('originalFileBlob', resizedDataUrl)
          sessionStorage.setItem('enhanceScale', enhanceScale)
          sessionStorage.setItem('faceEnhance', String(faceEnhance))
          window.location.href = '/enhance'
        }
        reader.readAsDataURL(uploadedFile)
      } catch {
        toast({
          title: 'Error',
          description: 'Failed to process image. Please try again.',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Hero Section ─────────────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-centre justify-centre py-10 sm:py-14 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-10 xs:top-16 sm:top-20 right-0 xs:right-10 w-48 xs:w-56 sm:w-72 h-48 xs:h-56 sm:h-72 bg-primary/5 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-centre space-y-5 xs:space-y-6 sm:space-y-7">
              {/* Badge */}
              <div className="inline-flex items-centre gap-2 px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium tracking-tight text-primary hover:border-primary/40 transition-colours">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0"></span>
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
              <div className="flex flex-col xs:flex-row items-stretch xs:items-centre justify-centre gap-3 xs:gap-4 pt-2 px-2 xs:px-0">
                <Button
                  asChild
                  size="lg"
                  className="px-6 xs:px-8 py-5 xs:py-6 text-sm xs:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="#upload" className="flex items-centre justify-centre xs:justify-start gap-3" aria-label="Start enhancing your photos">
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
                <StatCard value="500K+" label="Enhanced" highlight />
                <StatCard value="100%" label="Free" />
                <StatCard value="2s" label="Average" />
                <StatCard value="∞" label="No Limits" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Upload Section ────────────────────────────────────────────────── */}
        <GradientSection id="upload">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-centre space-y-4 mb-10">
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
                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Upscale Factor</label>
                      <div className="flex gap-2" role="group" aria-label="Upscale factor selection">
                        {['2x', '4x'].map((scale) => (
                          <button
                            key={scale}
                            onClick={() => setEnhanceScale(scale)}
                            aria-pressed={enhanceScale === scale}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                              enhanceScale === scale
                                ? 'bg-primary text-primary-foreground'
                                : 'border border-border bg-background hover:border-primary text-foreground'
                            }`}
                          >
                            {scale}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">2x is much faster than 4x</p>
                    </div>

                    <div className="space-y-3">
                      <label className="text-sm font-medium text-foreground">Face Enhancement</label>
                      <div className="flex items-centre gap-3">
                        <button
                          onClick={() => setFaceEnhance(!faceEnhance)}
                          aria-pressed={faceEnhance}
                          aria-label={`Face enhancement ${faceEnhance ? 'enabled' : 'disabled'}`}
                          className={`relative inline-flex h-8 w-14 items-centre rounded-full transition-colours ${
                            faceEnhance ? 'bg-primary' : 'bg-border'
                          }`}
                        >
                          <span
                            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                              faceEnhance ? 'translate-x-7' : 'translate-x-1'
                            }`}
                          />
                        </button>
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

                {/* Enhance Button */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleEnhance}
                    size="lg"
                    className="flex-1 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                    aria-label="Enhance the uploaded image"
                  >
                    <Wand2 className="w-5 h-5 mr-2" />
                    Enhance Image
                  </Button>
                  <Button
                    onClick={() => handleFileSelect(null)}
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

        {/* ── Features Section ──────────────────────────────────────────────── */}
        <GradientSection id="features">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-centre space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Why Choose PhotoGenerator.ai
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Built for creators who demand quality and simplicity
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
              <FeatureCard icon={Zap} title="Lightning Fast" description="Enhanced images in seconds. Optimised for speed without sacrificing quality." highlight />
              <FeatureCard icon={Shield} title="100% Private" description="Your images are never stored. Complete privacy with automatic deletion." />
              <FeatureCard icon={Wand2} title="AI-Powered" description="State-of-the-art algorithms deliver professional-grade results." />
              <FeatureCard icon={Download} title="Unlimited" description="No watermarks, no limits, no premium tier. Completely free." />
            </div>
          </div>
        </GradientSection>

        {/* ── How It Works ──────────────────────────────────────────────────── */}
        <GradientSection id="how-it-works">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-centre space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Simple Three-Step Process
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light">
                Quality enhancement made effortless
              </p>
            </div>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 max-w-3xl mx-auto">
              <Step number={1} title="Upload Your Image" description="Select or drag-and-drop any image. We support PNG, JPG, and WebP formats up to 10MB." />
              <Step number={2} title="AI Analysis &amp; Enhancement" description="Our advanced AI instantly analyses and enhances your image with clarity boost, noise reduction, and colour optimisation." />
              <Step number={3} title="Download &amp; Share" description="Get your enhanced image immediately. Share directly or download in high quality — no watermarks, no restrictions." />
            </div>
          </div>
        </GradientSection>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <GradientSection>
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-centre space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Trusted by Creators
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Photographers and content creators love PhotoGenerator.ai
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
              <TestimonialCard quote="PhotoGenerator.ai completely transformed my photo workflow. The quality is exceptional and it's truly free." author="Sarah Chen" role="Photographer" rating={5} />
              <TestimonialCard quote="I use it daily. The AI enhancement is spot-on, and there are no hidden paywalls or watermarks." author="Marcus Rodriguez" role="Content Creator" rating={5} />
              <TestimonialCard quote="Finally a tool that respects user privacy while delivering professional results. Highly recommend." author="Emma Williams" role="Digital Marketer" rating={5} />
            </div>
          </div>
        </GradientSection>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <CTASection
          title="Ready to Enhance Your Photos?"
          description="Join thousands of creators improving their images with PhotoGenerator.ai. Get started instantly — no sign-up required."
          primaryCTA={{ text: 'Start Enhancing', href: '#upload' }}
          secondaryCTA={{ text: 'Learn More', href: '#how-it-works' }}
        />
      </main>

      <Footer />
    </div>
  )
}
