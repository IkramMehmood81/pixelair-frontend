// app/enhance/page.tsx
//
// This page is no longer used — enhancement now happens inline on the home page.
// Redirect anyone who navigates directly to /enhance back to the home page.

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function EnhancePage() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/')
  }, [router])

  // Brief loading state while redirect fires
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-3 px-4">
          <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Redirecting…</p>
        </div>
      </main>
      <Footer />
    </div>
  )
}