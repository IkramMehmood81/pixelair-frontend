// app/enhance/page.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { Download, RotateCcw, Loader, CheckCircle2, ArrowLeft, AlertCircle, Zap } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { ComparisonSlider } from '@/components/comparison-slider'
import { EnhancementStats } from '@/components/enhancement-stats'
import { GradientSection } from '@/components/gradient-section'
import { CTASection } from '@/components/cta-section'

// ─── Types ────────────────────────────────────────────────────────────────────
type Stage = 'loading' | 'enhancing' | 'done' | 'error'

interface EnhanceResult {
  url: string
  processing_time: number
  original_size_kb: number
  scale: number
  face_enhance: boolean
}

interface EnhanceSettings {
  scale: number
  faceEnhance: boolean
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a base64 data-URI → Blob */
function dataURLtoBlob(dataURL: string): Blob {
  const [header, base64] = dataURL.split(',')
  const mime = header.match(/:(.*?);/)?.[1] ?? 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

/** Download a URL — works for both blob URLs and remote CDN URLs */
async function downloadImage(url: string, filename: string) {
  try {
    const res = await fetch(url)
    const blob = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = blobUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

// ─── Processing steps UI data ─────────────────────────────────────────────────
const STEPS = [
  { id: 'upload',   label: 'Image received &amp; validated' },
  { id: 'sending',  label: 'Sending to Real-ESRGAN AI' },
  { id: 'enhance',  label: 'Upscaling &amp; enhancing pixels' },
  { id: 'finish',   label: 'Finalising output image' },
]

// ─── User-friendly error messages ─────────────────────────────────────────────
function friendlyError(raw: string): string {
  if (!raw) return 'Enhancement failed. Please try again.'
  const lower = raw.toLowerCase()
  if (lower.includes('timeout') || lower.includes('timed out')) return 'Enhancement timed out. Please try again with a smaller image.'
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('econnrefused')) return 'Network error. Please check your connection and try again.'
  if (lower.includes('too large') || lower.includes('413')) return 'Image is too large. Please use an image under 10MB.'
  if (lower.includes('unsupported') || lower.includes('415')) return 'Unsupported image format. Please use JPEG, PNG, or WebP.'
  if (lower.includes('enhancement failed')) return 'Enhancement failed. Please try again.'
  return 'Enhancement failed. Please try again.'
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function EnhancePage() {
  const [stage, setStage]                 = useState<Stage>('loading')
  const [originalImage, setOriginalImage] = useState<string>('')
  const [enhancedImage, setEnhancedImage] = useState<string>('')
  const [result, setResult]               = useState<EnhanceResult | null>(null)
  const [errorMsg, setErrorMsg]           = useState<string>('')
  const [settings, setSettings]           = useState<EnhanceSettings>({ scale: 2, faceEnhance: false })
  const [activeStep, setActiveStep]       = useState<number>(0)

  // ── Animate processing steps while waiting ─────────────────────────────────
  useEffect(() => {
    if (stage !== 'enhancing') return
    const id = setInterval(() => {
      setActiveStep(s => Math.min(s + 1, STEPS.length - 1))
    }, 2200)
    return () => clearInterval(id)
  }, [stage])

  // ── Boot: read sessionStorage ──────────────────────────────────────────────
  useEffect(() => {
    const stored = sessionStorage.getItem('originalImage')
    const scale  = sessionStorage.getItem('enhanceScale')
    const face   = sessionStorage.getItem('faceEnhance')

    if (!stored) {
      setStage('error')
      setErrorMsg('No image found. Please upload one first.')
      return
    }

    const parsedSettings: EnhanceSettings = {
      scale: scale === '4x' ? 4 : 2,
      faceEnhance: face === 'true',
    }

    setOriginalImage(stored)
    setSettings(parsedSettings)
    runEnhancement(stored, parsedSettings)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Core enhancement function ──────────────────────────────────────────────
  const runEnhancement = useCallback(async (imageData: string, s: EnhanceSettings) => {
    setStage('enhancing')
    setActiveStep(0)
    setErrorMsg('')

    try {
      // Convert base64 data-URI → Blob → File
      const blob = dataURLtoBlob(imageData)
      const ext  = blob.type === 'image/png' ? 'png' : blob.type === 'image/webp' ? 'webp' : 'jpg'
      const file = new File([blob], `upload.${ext}`, { type: blob.type })

      // Build multipart FormData
      const form = new FormData()
      form.append('image',        file)
      form.append('scale',        String(s.scale))
      form.append('face_enhance', String(s.faceEnhance))

      // Call Next.js API route (which proxies to the backend)
      const res = await fetch('/api/enhance', {
        method: 'POST',
        body: form,
      })

      let data: Record<string, unknown> = {}
      try {
        data = await res.json()
      } catch {
        throw new Error('Enhancement failed. Please try again.')
      }

      if (!res.ok) {
        throw new Error((data?.error as string) ?? `Server error ${res.status}`)
      }

      if (!data.url) {
        throw new Error('Enhancement failed. Please try again.')
      }

      setResult(data as unknown as EnhanceResult)
      setEnhancedImage(data.url as string)
      setActiveStep(STEPS.length - 1)
      setStage('done')
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : 'Unexpected error occurred.'
      setErrorMsg(friendlyError(raw))
      setStage('error')
    }
  }, [])

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleDownload = () => {
    if (!enhancedImage) return
    const filename = `photogenerator-${settings.scale}x-${Date.now()}.png`
    downloadImage(enhancedImage, filename)
  }

  const handleNewEnhance = () => {
    sessionStorage.removeItem('originalImage')
    sessionStorage.removeItem('enhanceScale')
    sessionStorage.removeItem('faceEnhance')
    window.location.href = '/'
  }

  const handleRetry = () => {
    if (originalImage) runEnhancement(originalImage, settings)
  }

  // ── No image guard ─────────────────────────────────────────────────────────
  if (stage === 'error' && !originalImage) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-centre justify-centre">
          <div className="max-w-md w-full mx-auto px-4 text-centre py-20">
            <div className="inline-flex items-centre justify-centre w-16 h-16 rounded-full bg-destructive/10 mb-6">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-3">No Image Found</h1>
            <p className="text-muted-foreground mb-8 text-sm">{errorMsg}</p>
            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link href="/" className="flex items-centre justify-centre gap-2" aria-label="Return to home page">
                <ArrowLeft className="w-4 h-4" /> Go Back Home
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── ENHANCING STATE ─────────────────────────────────────────────── */}
        {stage === 'enhancing' && (
          <GradientSection className="flex items-centre justify-centre min-h-[75vh]">
            <div className="max-w-md w-full mx-auto px-4 text-centre">
              {/* Spinner */}
              <div className="relative inline-flex items-centre justify-centre w-20 h-20 mb-8" role="status" aria-label="Enhancing image">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <Zap className="w-8 h-8 text-primary" />
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">Enhancing Your Image</h1>
              <p className="text-muted-foreground text-sm mb-8">
                Real-ESRGAN {settings.scale}x
                {settings.faceEnhance ? ' + Face Restore' : ''} — usually under 15 seconds
              </p>

              {/* Animated step list */}
              <div className="text-left space-y-3 max-w-xs mx-auto">
                {STEPS.map((step, i) => {
                  const isDone   = i < activeStep
                  const isActive = i === activeStep
                  return (
                    <div key={step.id} className="flex items-centre gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-centre justify-centre">
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-primary" />
                        ) : isActive ? (
                          <Loader className="w-4 h-4 text-primary animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border-2 border-border" />
                        )}
                      </div>
                      <span
                        className={`text-sm ${isDone || isActive ? 'text-foreground' : 'text-muted-foreground'}`}
                        dangerouslySetInnerHTML={{ __html: step.label }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          </GradientSection>
        )}

        {/* ── ERROR STATE ─────────────────────────────────────────────────── */}
        {stage === 'error' && originalImage && (
          <GradientSection className="flex items-centre justify-centre min-h-[75vh]">
            <div className="max-w-md w-full mx-auto px-4 text-centre">
              <div className="inline-flex items-centre justify-centre w-16 h-16 rounded-full bg-destructive/10 mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-3">Enhancement Failed</h1>
              <p className="text-muted-foreground mb-2 text-sm leading-relaxed">{errorMsg}</p>
              <p className="text-xs text-muted-foreground mb-6">
                If the problem persists, please contact{' '}
                <a href="mailto:support@photogenerator.ai" className="text-primary hover:underline">
                  support@photogenerator.ai
                </a>
              </p>
              <div className="flex gap-3 justify-centre mt-2">
                <Button onClick={handleRetry} className="bg-primary hover:bg-primary/90" aria-label="Retry enhancement">
                  <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                </Button>
                <Button asChild variant="outline">
                  <Link href="/" aria-label="Return to home page"><ArrowLeft className="w-4 h-4 mr-1" /> Home</Link>
                </Button>
              </div>
            </div>
          </GradientSection>
        )}

        {/* ── DONE STATE ──────────────────────────────────────────────────── */}
        {stage === 'done' && enhancedImage && (
          <>
            <GradientSection>
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div className="flex items-centre gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Enhancement Complete</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        Real-ESRGAN {settings.scale}x
                        {settings.faceEnhance ? ' + Face Restore' : ''}
                        {result ? ` · ${result.processing_time}s` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex"
                    aria-label="Download enhanced image"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                </div>

                {/* Before / After thumbnails */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Original
                      {result ? ` · ${result.original_size_kb.toFixed(0)} KB` : ''}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-border bg-card">
                      <img
                        src={originalImage}
                        alt="Original image before enhancement"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Enhanced {settings.scale}x
                    </p>
                    <div className="rounded-xl overflow-hidden border border-primary/40 bg-card relative">
                      <img
                        src={enhancedImage}
                        alt="Enhanced image after AI processing"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        crossOrigin="anonymous"
                        loading="lazy"
                      />
                      <span className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full font-medium pointer-events-none">
                        AI Enhanced
                      </span>
                    </div>
                  </div>
                </div>

                {/* Drag-to-compare slider */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    ← Drag to compare before / after →
                  </p>
                  <div className="rounded-xl overflow-hidden border border-border max-h-[420px]">
                    <ComparisonSlider
                      beforeImage={originalImage}
                      afterImage={enhancedImage}
                      beforeLabel="Original"
                      afterLabel={`Enhanced ${settings.scale}x`}
                    />
                  </div>
                </div>

                {/* Enhancement stats */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">Enhancement Applied</h2>
                  <EnhancementStats
                    clarity={85}
                    colourGrade={92}
                    noiseReduction={78}
                    sharpness={88}
                  />
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    aria-label="Download enhanced image"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Enhanced Image
                  </Button>
                  <Button
                    onClick={handleNewEnhance}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    aria-label="Start a new enhancement"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Enhance Another
                  </Button>
                </div>

              </div>
            </GradientSection>

            <CTASection
              title="Satisfied with Your Results?"
              description="Share your enhanced photos or enhance more images. Your photos deserve the best."
              primaryCTA={{ text: 'Enhance More Photos', href: '/' }}
              secondaryCTA={{ text: 'Share on Social', href: '#' }}
            />
          </>
        )}

      </main>

      <Footer />
    </div>
  )
}
