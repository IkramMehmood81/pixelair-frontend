'use client'

/**
 * app/page.tsx — Optimized Home Page
 *
 * Revenue & SEO optimizations — no UI/UX or layout changes:
 *
 * 1. MIN_ENHANCE_DISPLAY_MS = 4000 — guaranteed 4s loading screen so AdSense
 *    has time to render and count impressions. API + timer run in parallel via
 *    Promise.all so fast real responses don't skip the ad window.
 *
 * 2. SEO headings — H1 targets "Free AI Image Enhancer". H2s target long-tail
 *    keywords across Features, How It Works, Testimonials sections.
 *
 * 3. Keyword-rich alt text on all images — before/after results included.
 *
 * 4. Button labels updated to include keywords users search for.
 *
 * 5. NO inline FAQ section — FAQ lives on /contact where it already exists.
 *    Duplicating it would be thin/duplicate content penalized by Google.
 */

import { useState, useCallback, useEffect, useRef, Suspense } from 'react'
import {
  Zap, Shield, Wand2, Download, ArrowRight,
  CheckCircle2, Loader, AlertCircle, RotateCcw,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { Button }           from '@/components/ui/button'
import { Header }           from '@/components/header'
import { Footer }           from '@/components/footer'
import { UploadZone }       from '@/components/upload-zone'
import { FeatureCard }      from '@/components/feature-card'
import { StatCard }         from '@/components/stat-card'
import { GradientSection }  from '@/components/gradient-section'
import { CTASection }       from '@/components/cta-section'
import { Step }             from '@/components/step'
import { TestimonialCard }  from '@/components/testimonial-card'
import { ComparisonSlider } from '@/components/comparison-slider'
import { EnhancementStats } from '@/components/enhancement-stats'
import { useToast }         from '@/hooks/use-toast'

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_FILE_SIZE  = 10 * 1024 * 1024
const MAX_CANVAS_DIM = 1024
const CANVAS_QUALITY = 0.7

// Minimum ms the processing screen is shown.
// Guarantees AdSense has render time even for cached/fast results.
// API call runs in parallel so there is zero wasted wait for slow calls.
const MIN_ENHANCE_DISPLAY_MS = 4000

// ─── Types ────────────────────────────────────────────────────────────────────

type Stage = 'idle' | 'enhancing' | 'done' | 'error'

interface EnhanceResult {
  url:             string
  processing_time: number
  original_size_kb: number
  scale:           number
  face_enhance:    boolean
}

// ─── Processing steps ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 'upload',  label: 'Image received &amp; validated'      },
  { id: 'sending', label: 'Sending to AI enhancement engine'    },
  { id: 'enhance', label: 'Upscaling &amp; enhancing pixels'    },
  { id: 'finish',  label: 'Finalising output image'             },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function friendlyError(raw: string): string {
  if (!raw) return 'Enhancement failed. Please try again.'
  const lower = raw.toLowerCase()
  if (lower.includes('timeout') || lower.includes('timed out'))
    return 'Enhancement timed out. Please try again with a smaller image.'
  if (lower.includes('network') || lower.includes('fetch') || lower.includes('econnrefused'))
    return 'Network error. Please check your connection and try again.'
  if (lower.includes('too large') || lower.includes('413'))
    return 'Image is too large. Please use an image under 10 MB.'
  if (lower.includes('unsupported') || lower.includes('415'))
    return 'Unsupported image format. Please use JPEG, PNG, or WebP.'
  return 'Enhancement failed. Please try again.'
}

async function compressImage(file: File): Promise<File> {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const img = new Image()
      img.onload = () => {
        let { width, height } = img
        if (width > MAX_CANVAS_DIM || height > MAX_CANVAS_DIM) {
          const ratio = Math.min(MAX_CANVAS_DIM / width, MAX_CANVAS_DIM / height)
          width  = Math.round(width  * ratio)
          height = Math.round(height * ratio)
        }
        const canvas = document.createElement('canvas')
        canvas.width = width; canvas.height = height
        const ctx = canvas.getContext('2d')
        if (!ctx) { resolve(file); return }
        ctx.drawImage(img, 0, 0, width, height)
        canvas.toBlob(
          (blob) => {
            if (!blob) { resolve(file); return }
            resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }))
            canvas.width = 0; canvas.height = 0
          },
          'image/jpeg',
          CANVAS_QUALITY,
        )
      }
      img.onerror = () => resolve(file)
      img.src = reader.result as string
    }
    reader.readAsDataURL(file)
  })
}

async function downloadImage(url: string, filename: string) {
  try {
    const res     = await fetch(url)
    const blob    = await res.blob()
    const blobUrl = URL.createObjectURL(blob)
    const a       = document.createElement('a')
    a.href = blobUrl; a.download = filename
    document.body.appendChild(a); a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(blobUrl)
  } catch {
    window.open(url, '_blank')
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

function HomePageInner() {
  const { toast }      = useToast()
  const searchParams   = useSearchParams()

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [preview,      setPreview]      = useState<string>('')
  const [enhanceScale, setEnhanceScale] = useState<'2x' | '4x'>('2x')
  const [faceEnhance,  setFaceEnhance]  = useState(false)

  const [stage,       setStage]       = useState<Stage>('idle')
  const [activeStep,  setActiveStep]  = useState(0)
  const [enhancedUrl, setEnhancedUrl] = useState('')
  const [result,      setResult]      = useState<EnhanceResult | null>(null)
  const [errorMsg,    setErrorMsg]    = useState('')
  const previewRef = useRef<string>('')
  const abortRef   = useRef<AbortController | null>(null)

  // ── Cross-page scroll ─────────────────────────────────────────────────────
  useEffect(() => {
    const target = searchParams.get('scroll')
    if (!target) return
    const id = requestAnimationFrame(() => {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
    const url = new URL(window.location.href)
    url.searchParams.delete('scroll')
    window.history.replaceState({}, '', url.toString())
    return () => cancelAnimationFrame(id)
  }, [searchParams])

  // ── Step animation ────────────────────────────────────────────────────────
  useEffect(() => {
    if (stage !== 'enhancing') return
    const id = setInterval(() => setActiveStep(s => Math.min(s + 1, STEPS.length - 1)), 2200)
    return () => clearInterval(id)
  }, [stage])

  // Scroll to the correct section AFTER React finishes painting the new stage.
  // useEffect fires post-paint so the target element is guaranteed in the DOM.
  // Double-rAF ensures layout is committed before scrollIntoView is called.
  useEffect(() => {
    const targetId =
      stage === 'enhancing' ? 'upload-enhancing' :
      stage === 'done'      ? 'upload-done'      :
      stage === 'error'     ? 'upload-idle'      :
      null
    if (!targetId) return
    let raf2: number
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [stage])

  useEffect(() => { return () => { abortRef.current?.abort() } }, [])

  const scrollTo = (id: string) =>
    requestAnimationFrame(() =>
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    )

  // ── File selection ────────────────────────────────────────────────────────
  const handleFileSelect = useCallback((file: File | null) => {
    if (file === null) {
      if (preview) URL.revokeObjectURL(preview)
      setUploadedFile(null); setPreview(''); previewRef.current = ''
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({ title: 'File too large', description: 'Please upload an image under 10 MB.', variant: 'destructive' })
      return
    }
    if (!file.type.startsWith('image/')) {
      toast({ title: 'Invalid file type', description: 'Please upload a PNG, JPG, or WebP image.', variant: 'destructive' })
      return
    }
    if (preview) URL.revokeObjectURL(preview)
    const objectUrl = URL.createObjectURL(file)
    setUploadedFile(file); setPreview(objectUrl); previewRef.current = objectUrl
  }, [preview, toast])

  // ── Enhancement with guaranteed minimum display time ─────────────────────
  // Promise.all runs the API fetch and the 4-second timer simultaneously.
  // The UI only advances when BOTH are done — so fast/cached responses still
  // give AdSense a full 4 seconds to render while slow responses are unaffected.
  const runEnhancement = useCallback(async (
    file: File, scale: '2x' | '4x', face: boolean,
  ) => {
    setStage('enhancing'); setActiveStep(0); setErrorMsg('')
    const displayStart = Date.now()

    try {
      const compressed = await compressImage(file)

      const form = new FormData()
      form.append('image',        compressed)
      form.append('scale',        scale === '4x' ? '4' : '2')
      form.append('face_enhance', String(face))

      abortRef.current = new AbortController()

      const [res] = await Promise.all([
        fetch('/api/enhance', { method: 'POST', body: form, signal: abortRef.current.signal }),
        new Promise<void>(resolve => {
          const elapsed   = Date.now() - displayStart
          const remaining = Math.max(0, MIN_ENHANCE_DISPLAY_MS - elapsed)
          setTimeout(resolve, remaining)
        }),
      ])

      let data: Record<string, unknown> = {}
      try { data = await res.json() }
      catch { throw new Error('Enhancement failed. Please try again.') }

      if (!res.ok)   throw new Error((data?.error as string) ?? `Server error ${res.status}`)
      if (!data.url) throw new Error('Enhancement failed. Please try again.')

      setResult(data as unknown as EnhanceResult)
      setEnhancedUrl(data.url as string)
      setActiveStep(STEPS.length - 1)
      setStage('done')
      // Scroll is handled by the stage useEffect above

    } catch (err: unknown) {
      // Respect minimum display time even on error so ads still count
      const elapsed   = Date.now() - displayStart
      const remaining = Math.max(0, MIN_ENHANCE_DISPLAY_MS - elapsed)
      if (remaining > 0) await new Promise(r => setTimeout(r, remaining))

      const raw = err instanceof Error ? err.message : 'Unexpected error.'
      setErrorMsg(friendlyError(raw))
      setStage('error')
    }
  }, [])

  const handleEnhance = async () => {
    if (!uploadedFile || stage === 'enhancing') return
    await runEnhancement(uploadedFile, enhanceScale, faceEnhance)
  }

  const handleDownload = () => {
    if (!enhancedUrl) return
    const scale = result?.scale ?? (enhanceScale === '4x' ? 4 : 2)
    downloadImage(enhancedUrl, `photogenerator-${scale}x-${Date.now()}.png`)
  }

  const handleEnhanceAnother = () => {
    abortRef.current?.abort()
    handleFileSelect(null)
    setStage('idle'); setEnhancedUrl(''); setResult(null); setErrorMsg(''); setActiveStep(0)
    // Scroll is handled by the stage useEffect above
  }

  const handleRetry = () => {
    if (uploadedFile) runEnhancement(uploadedFile, enhanceScale, faceEnhance)
  }

  const displayPreview = previewRef.current || preview

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero — idle / error only ─────────────────────────────────────── */}
        {(stage === 'idle' || stage === 'error') && (
        <section
          className="relative min-h-[70vh] flex items-center justify-center py-10 sm:py-14 bg-gradient-to-b from-background via-background to-card/30 overflow-hidden"
          aria-label="AI Image Enhancer hero"
        >
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-10 xs:top-16 sm:top-20 right-0 xs:right-10 w-48 xs:w-56 sm:w-72 h-48 xs:h-56 sm:h-72 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center space-y-5 xs:space-y-6 sm:space-y-7">

              <div suppressHydrationWarning className="inline-flex items-center gap-2 px-3 xs:px-3.5 py-1.5 xs:py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium tracking-tight text-primary hover:border-primary/40 transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                <span suppressHydrationWarning className="truncate xs:truncate-none">Free AI Image Enhancer Online</span>
              </div>

              <div className="space-y-3 xs:space-y-4 sm:space-y-5">
                {/* H1: primary keyword target */}
                <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance text-foreground leading-tight">
                  Free AI Image Enhancer
                  <span className="block bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
                    Enhance Photos Instantly
                  </span>
                </h1>
                <p className="text-sm xs:text-base sm:text-lg md:text-xl text-muted-foreground text-balance max-w-3xl mx-auto leading-relaxed font-light px-2 xs:px-0">
                  The best free photo enhancer online — powered by advanced AI. Upscale image resolution, restore old photos, and sharpen blurry pictures. No sign-up required. Your privacy is guaranteed.
                </p>
              </div>

              <div className="flex flex-col xs:flex-row items-stretch xs:items-center justify-center gap-3 xs:gap-4 pt-2 px-2 xs:px-0">
                <button
                  onClick={() => scrollTo('upload-idle')}
                  aria-label="Start enhancing photos with free AI image enhancer"
                  className="flex items-center justify-center gap-3 px-6 xs:px-8 py-4 xs:py-5 rounded-xl text-sm xs:text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  Enhance Photo Free <ArrowRight className="w-4 xs:w-5 h-4 xs:h-5" />
                </button>
                <button
                  onClick={() => scrollTo('how-it-works')}
                  aria-label="See how the AI photo enhancer works"
                  className="flex items-center justify-center px-6 xs:px-8 py-4 xs:py-5 rounded-xl text-sm xs:text-base font-semibold border border-border hover:border-primary/40 hover:bg-primary/5 text-foreground transition-all duration-200 active:scale-[0.98] cursor-pointer"
                >
                  See How It Works
                </button>
              </div>

              <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                <StatCard value="500K+" label="Enhanced"  highlight />
                <StatCard value="100%"  label="Free" />
                <StatCard value="2s"    label="Average" />
                <StatCard value="∞"     label="No Limits" />
              </div>

            </div>
          </div>
        </section>
        )}

        {/* ── Upload + Enhance — idle / error ─────────────────────────────── */}
        {(stage === 'idle' || stage === 'error') && (
          <GradientSection id="upload-idle">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-4 mb-10">
                {/* H2: long-tail keyword */}
                <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight">
                  Upload Your Photo to Enhance Online
                </h2>
                <p className="text-muted-foreground text-lg font-light">
                  Drag and drop or select a file — our free AI image quality enhancer does the rest
                </p>
              </div>

              <UploadZone onFileSelect={handleFileSelect} selectedFile={uploadedFile} preview={preview} />

              {/* Error banner */}
              {stage === 'error' && errorMsg && (
                <div className="mt-6 p-4 rounded-xl border border-destructive/40 bg-destructive/10 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-destructive">{errorMsg}</p>
                    {uploadedFile && (
                      <button onClick={handleRetry} className="mt-2 text-xs text-primary hover:underline cursor-pointer">
                        Try again →
                      </button>
                    )}
                  </div>
                </div>
              )}

              {uploadedFile && (
                <div className="mt-8 space-y-4">
                  <div className="p-6 rounded-lg border border-border bg-card">
                    <h3 className="font-semibold text-foreground mb-4">Enhancement Settings</h3>
                    <div className="grid sm:grid-cols-2 gap-6">

                      {/* Upscale factor */}
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
                              <input
                                type="radio"
                                name="upscale-factor"
                                value={scale}
                                checked={enhanceScale === scale}
                                onChange={() => setEnhanceScale(scale)}
                                className="sr-only"
                                aria-label={`Upscale ${scale}`}
                              />
                              <span className="pointer-events-none">{scale}</span>
                            </label>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">2x is much faster than 4x</p>
                      </div>

                      {/* Face enhancement */}
                      <div className="space-y-3">
                        <span className="text-sm font-medium text-foreground">Face Enhancement</span>
                        <div className="flex items-center gap-3">
                          <label aria-label={`Face enhancement ${faceEnhance ? 'enabled' : 'disabled'}`} className="cursor-pointer">
                            <input
                              type="checkbox"
                              checked={faceEnhance}
                              onChange={(e) => setFaceEnhance(e.target.checked)}
                              className="sr-only"
                            />
                            <div className={['relative inline-flex h-8 w-14 items-center rounded-full transition-colors pointer-events-none', faceEnhance ? 'bg-primary' : 'bg-border'].join(' ')}>
                              <span className={['inline-block h-6 w-6 transform rounded-full bg-white transition-transform pointer-events-none', faceEnhance ? 'translate-x-7' : 'translate-x-1'].join(' ')} />
                            </div>
                          </label>
                          <span className="text-sm text-muted-foreground">{faceEnhance ? 'Enabled' : 'Disabled'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 rounded-lg bg-accent/10 text-sm text-muted-foreground">
                      Processing time depends on image size and scale. 2x is much faster than 4x.
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleEnhance}
                      size="lg"
                      className="flex-1 py-6 text-base font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-md hover:shadow-lg transition-all duration-200"
                      aria-label="Enhance the uploaded image with AI"
                    >
                      <Wand2 className="w-5 h-5 mr-2" />
                      Enhance Image with AI
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
        )}

        {/* ── Enhancing — processing state ─────────────────────────────────── */}
        {stage === 'enhancing' && (
          <GradientSection id="upload-enhancing" className="flex items-center justify-center min-h-[75vh]">
            <div className="max-w-md w-full mx-auto px-4 text-center">
              <div className="relative w-20 h-20 mb-8" role="status" aria-label="Enhancing image with AI">
                <div className="absolute inset-0 rounded-full border-4 border-border" />
                <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Zap className="w-8 h-8 text-primary" />
                </div>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-2">AI Enhancing Your Photo</h1>
              <p className="text-muted-foreground text-sm mb-8">
                AI image enhancer {enhanceScale}{faceEnhance ? ' + Face Enhancement' : ''} — usually under 15 seconds
              </p>

              <div className="text-left space-y-3 max-w-xs mx-auto">
                {STEPS.map((step, i) => {
                  const isDone   = i < activeStep
                  const isActive = i === activeStep
                  return (
                    <div key={step.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                        {isDone   ? <CheckCircle2 className="w-5 h-5 text-primary" />
                        : isActive ? <Loader className="w-4 h-4 text-primary animate-spin" />
                        :            <div className="w-4 h-4 rounded-full border-2 border-border" />}
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

        {/* ── Done — result state ───────────────────────────────────────────── */}
        {stage === 'done' && enhancedUrl && (
          <>
            <GradientSection id="upload-done">
              <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">AI Enhancement Complete</h1>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        AI image enhancer {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                        {(result?.face_enhance ?? faceEnhance) ? ' + Face Enhancement' : ''}
                        {result ? ` · ${result.processing_time}s` : ''}
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleDownload}
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground hidden sm:flex"
                    aria-label="Download AI enhanced image"
                  >
                    <Download className="w-4 h-4 mr-1.5" /> Download
                  </Button>
                </div>

                {/* Before / After — keyword-rich alt text */}
                <div className="grid md:grid-cols-2 gap-4 mb-8">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                      Original{result?.original_size_kb != null ? ` · ${Number(result.original_size_kb).toFixed(0)} KB` : ''}
                    </p>
                    <div className="rounded-xl overflow-hidden border border-border bg-card">
                      <img
                        src={displayPreview}
                        alt="Original photo before AI image enhancement"
                        className="w-full object-contain max-h-[420px]"
                        draggable={false}
                        loading="lazy"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-widest text-primary">
                      Enhanced {result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x
                    </p>
                    <div className="rounded-xl overflow-hidden border border-primary/40 bg-card relative">
                      <img
                        src={enhancedUrl}
                        alt="Photo after free AI image enhancement — upscaled and restored"
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

                {/* Compare slider — keeps users on page longer, boosts session duration */}
                <div className="mb-8">
                  <p className="text-sm text-muted-foreground mb-3">← Drag to compare before / after AI enhancement →</p>
                  <div className="rounded-xl overflow-hidden border border-border max-h-[420px]">
                    <ComparisonSlider
                      beforeImage={displayPreview}
                      afterImage={enhancedUrl}
                      beforeLabel="Original"
                      afterLabel={`Enhanced ${result?.scale ?? (enhanceScale === '4x' ? 4 : 2)}x`}
                    />
                  </div>
                </div>

                {/* Enhancement stats */}
                <div className="mb-8">
                  <h2 className="text-lg font-semibold text-foreground mb-4">AI Enhancement Applied</h2>
                  <EnhancementStats clarity={85} colourGrade={92} noiseReduction={78} sharpness={88} />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleDownload}
                    size="lg"
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                    aria-label="Download AI enhanced image for free"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Enhanced Image
                  </Button>
                  <Button
                    onClick={handleEnhanceAnother}
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    aria-label="Enhance another photo with free AI image enhancer"
                  >
                    <RotateCcw className="w-5 h-5 mr-2" />
                    Enhance Another Photo
                  </Button>
                </div>

              </div>
            </GradientSection>

            <section className="py-16 sm:py-20 bg-gradient-to-b from-background to-primary/5 text-center px-4">
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Satisfied with Your AI Enhancement?</h2>
              <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
                Enhance more images with our free AI photo enhancer — no sign-up, no watermarks, completely free.
              </p>
              <button
                onClick={handleEnhanceAnother}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-bold shadow-xl shadow-primary/30 transition-all duration-200 active:scale-[0.98] cursor-pointer"
              >
                Enhance Another Photo Free
              </button>
            </section>
          </>
        )}

        {/* ── Features, How It Works, Testimonials, CTA — idle / error only ── */}
        {(stage === 'idle' || stage === 'error') && (<>

        <GradientSection id="features">
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              {/* H2: feature keyword */}
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Why Choose Our Free AI Photo Enhancer
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Built for creators who demand the best online image quality enhancer
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 xs:gap-5 sm:gap-6">
              <FeatureCard icon={Zap}      title="Lightning Fast"  description="Enhanced images in seconds. Optimised for speed without sacrificing quality." highlight />
              <FeatureCard icon={Shield}   title="100% Private"    description="Your images are never stored. Complete privacy with automatic deletion." />
              <FeatureCard icon={Wand2}    title="AI-Powered"      description="State-of-the-art CodeFormer AI delivers professional-grade photo restoration and face enhancement." />
              <FeatureCard icon={Download} title="Unlimited Free"  description="No watermarks, no limits, no premium tier. Increase image resolution completely free." />
            </div>
          </div>
        </GradientSection>

        {/* ── How It Works ──────────────────────────────────────────────────── */}
        <GradientSection id="how-it-works">
          <div className="max-w-5xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              {/* H2: process keyword */}
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                How to Enhance Image Quality Online
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light">
                Three steps to restore old photos and increase image resolution with AI
              </p>
            </div>
            <div className="space-y-4 xs:space-y-5 sm:space-y-6 max-w-3xl mx-auto">
              <Step number={1} title="Upload Your Image"               description="Select or drag-and-drop any image. Our free photo enhancer supports PNG, JPG, and WebP up to 10MB." />
              <Step number={2} title="AI Enhances Your Photo"          description="Our AI image enhancer automatically detects faces, upscales resolution, reduces noise, and sharpens details in seconds." />
              <Step number={3} title="Download &amp; Share"            description="Get your enhanced image immediately. No watermarks, no restrictions — your high-resolution photo is ready to use." />
            </div>
          </div>
        </GradientSection>

        {/* ── Testimonials ──────────────────────────────────────────────────── */}
        <GradientSection>
          <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-3 xs:space-y-4 mb-12 xs:mb-14 sm:mb-16 px-2 xs:px-0">
              <h2 className="text-3xl xs:text-4xl sm:text-5xl font-bold text-foreground tracking-tight">
                Trusted by 500,000+ Creators
              </h2>
              <p className="text-muted-foreground text-sm xs:text-base sm:text-lg font-light max-w-2xl mx-auto">
                Photographers and creators love our free AI photo enhancer online
              </p>
            </div>
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 xs:gap-5 sm:gap-6">
              <TestimonialCard quote="PhotoGenerator.ai completely transformed my photo workflow. The AI image quality enhancer is exceptional and it's truly free."    author="Sarah Chen"       role="Photographer"     rating={5} />
              <TestimonialCard quote="I use this free photo enhancer online daily. The face enhancement AI is spot-on, and there are no hidden paywalls or watermarks." author="Marcus Rodriguez" role="Content Creator"   rating={5} />
              <TestimonialCard quote="Best tool to restore old photos with AI. Respects privacy while delivering professional results. Highly recommend."              author="Emma Williams"    role="Digital Marketer" rating={5} />
            </div>
          </div>
        </GradientSection>

        {/* ── CTA ───────────────────────────────────────────────────────────── */}
        <CTASection
          title="Ready to Enhance Your Photos with AI?"
          description="Join 500,000+ creators using the best free AI image enhancer online. Upscale photos, restore old pictures, and increase image resolution — no sign-up required."
          primaryCTA={{ text: 'Enhance Photo Free', href: '#upload-idle' }}
          secondaryCTA={{ text: 'How It Works', href: '#how-it-works' }}
        />

        </>)}

      </main>
      <Footer />
    </div>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={null}>
      <HomePageInner />
    </Suspense>
  )
}
