// app/api/enhance/route.ts
// Next.js App Router API route — proxies image to FastAPI backend

import { NextRequest, NextResponse } from 'next/server'

const BACKEND_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? 'http://localhost:8000'
const MAX_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

// ── In-memory rate limiter (per IP, sliding window) ───────────────────────────
// Allows 10 requests per 60 seconds per IP. No external dependency needed.
const RATE_LIMIT_MAX    = 10
const RATE_LIMIT_WINDOW = 60_000 // 1 minute in ms
const ipTimestamps      = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const hits = (ipTimestamps.get(ip) ?? []).filter(t => now - t < RATE_LIMIT_WINDOW)
  hits.push(now)
  ipTimestamps.set(ip, hits)
  // Periodically clean stale IPs to prevent memory growth
  if (ipTimestamps.size > 5000) {
    for (const [key, times] of ipTimestamps) {
      if (times.every(t => now - t >= RATE_LIMIT_WINDOW)) ipTimestamps.delete(key)
    }
  }
  return hits.length > RATE_LIMIT_MAX
}

// ── Magic-byte validation — cannot be spoofed by the client ──────────────────
async function hasValidImageBytes(file: File): Promise<boolean> {
  const buf  = await file.slice(0, 12).arrayBuffer()
  const b    = new Uint8Array(buf)
  const isJpeg = b[0] === 0xFF && b[1] === 0xD8
  const isPng  = b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4E && b[3] === 0x47
  const isWebp = b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46
                 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  return isJpeg || isPng || isWebp
}

export async function POST(req: NextRequest) {
  try {
    // ── 0. Rate limiting ───────────────────────────────────────────────────
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'anonymous'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please wait a minute and try again.' },
        { status: 429 }
      )
    }

    // ── 1. Parse incoming multipart form ──────────────────────────────────
    const formData = await req.formData()
    const file = formData.get('image') as File | null
    const scale = formData.get('scale') ?? '2'
    const faceEnhance = formData.get('face_enhance') ?? 'false'

    // ── 2. Validate ────────────────────────────────────────────────────────
    if (!file) {
      return NextResponse.json({ error: 'No image provided.' }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a JPEG, PNG, or WebP image.' },
        { status: 415 }
      )
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10 MB.' },
        { status: 413 }
      )
    }

    // ── 2b. Magic-byte check — verifies the real file bytes, not just header ──
    if (!(await hasValidImageBytes(file))) {
      return NextResponse.json(
        { error: 'Invalid image file. Please upload a real JPEG, PNG, or WebP image.' },
        { status: 415 }
      )
    }

    const scaleNum = Number(scale)
    if (![2, 4].includes(scaleNum)) {
      return NextResponse.json({ error: 'Scale must be 2 or 4.' }, { status: 400 })
    }

    // ── 3. Forward to FastAPI backend ──────────────────────────────────────
    const backendForm = new FormData()
    backendForm.append('image', file)
    backendForm.append('scale', String(scaleNum))
    backendForm.append('face_enhance', faceEnhance === 'true' ? 'true' : 'false')

    const backendRes = await fetch(`${BACKEND_URL}/enhance-image`, {
      method: 'POST',
      body: backendForm,
      // No Content-Type header — let fetch set multipart boundary automatically
      signal: AbortSignal.timeout(120_000), // 2-min timeout
    })

    // ── 4. Handle backend errors ───────────────────────────────────────────
    if (!backendRes.ok) {
      let detail = 'Enhancement failed. Please try again.'
      try {
        const errBody = await backendRes.json()
        detail = errBody?.detail ?? detail
      } catch {
        // backend returned non-JSON
      }
      return NextResponse.json({ error: detail }, { status: backendRes.status })
    }

    // ── 5. Return success ──────────────────────────────────────────────────
    const data = await backendRes.json()
    return NextResponse.json(data)

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error.'

    // Timeout
    if (message.includes('abort') || message.includes('timeout') || message.includes('TimeoutError')) {
      return NextResponse.json(
        { error: 'Enhancement timed out. Please try again.' },
        { status: 504 }
      )
    }

    // Network failure
    if (message.includes('fetch') || message.includes('ECONNREFUSED') || message.includes('network')) {
      return NextResponse.json(
        { error: 'Enhancement failed. Please try again.' },
        { status: 503 }
      )
    }

    console.error('[/api/enhance]', err)
    return NextResponse.json({ error: 'Enhancement failed. Please try again.' }, { status: 500 })
  }
}