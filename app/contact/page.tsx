'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CheckCircle, Mail, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GradientSection } from '@/components/gradient-section'
// FAQSection is used below the contact form — faq-section.tsx + ui/accordion.tsx must be present
import { FAQSection } from '@/components/faq-section'

// ─── FAQ data ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    question: 'What image formats are supported?',
    answer: 'We support JPEG, PNG, and WebP images up to 10 MB. Other formats like TIFF or HEIC should be converted before uploading.',
  },
  {
    question: 'Are my uploaded images stored on your servers?',
    answer: 'No. All uploaded images are automatically deleted within 24 hours of processing. We never use your images for training or share them with third parties.',
  },
  {
    question: 'What is the difference between 2x and 4x upscaling?',
    answer: '2x doubles the image dimensions and is significantly faster — usually under 10 seconds. 4x quadruples the dimensions and produces larger output files, but takes longer to process.',
  },
  {
    question: 'What does Face Enhancement do?',
    answer: 'Face Enhancement applies an additional GFPGAN restoration pass specifically tuned for facial details — sharpening eyes, skin texture, and facial structure. Enable it when your image contains people.',
  },
  {
    question: 'Why did my enhancement fail?',
    answer: 'Common causes are: the image exceeds 10 MB, an unsupported format was used, or a temporary server timeout. Try compressing the image first, then re-upload. If the problem persists, contact support.',
  },
  {
    question: 'Is the service really free?',
    answer: 'Yes — completely free with no watermarks, no sign-up required, and no hidden limits. We are ad-supported to cover server costs.',
  },
]

// ─── Component ──────────────────────────────────────────────────────────────────
export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  // Smooth-scroll to the FAQ section when "View FAQ" is clicked
  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <GradientSection className="pt-20 sm:pt-28">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Page heading */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Have a question or feedback about PhotoGenerator.ai? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            {/* Contact info cards */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Reach us directly via email for inquiries and support.
                </p>
                <a href="mailto:support@photogenerator.ai" className="text-primary font-medium hover:underline text-sm">
                  support@photogenerator.ai
                </a>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4">
                  <MessageSquare className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We typically respond to inquiries within 24 business hours.
                </p>
                <p className="text-primary font-medium text-sm">Monday – Friday</p>
              </div>

              <div className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-secondary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">FAQ Available</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Check our documentation for common questions and solutions.
                </p>
                {/* Was a dead <button> before — now scrolls to the real FAQ below */}
                <button
                  onClick={scrollToFAQ}
                  className="text-primary font-medium hover:underline text-sm"
                >
                  View FAQ ↓
                </button>
              </div>
            </div>

            {/* Contact form */}
            <div className="max-w-2xl mx-auto">
              <div className="p-8 rounded-2xl border border-border bg-card">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">Message Sent!</h3>
                    <p className="text-muted-foreground">
                      Thank you for reaching out. We'll get back to you shortly.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          Full Name
                        </label>
                        <input
                          id="name" name="name" type="text"
                          value={formData.name} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          Email Address
                        </label>
                        <input
                          id="email" name="email" type="email"
                          value={formData.email} onChange={handleChange} required
                          className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-foreground mb-2">
                        Subject
                      </label>
                      <input
                        id="subject" name="subject" type="text"
                        value={formData.subject} onChange={handleChange} required
                        className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
                        placeholder="How can we help?"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message
                      </label>
                      <textarea
                        id="message" name="message"
                        value={formData.message} onChange={handleChange} required rows={6}
                        className="w-full px-4 py-3 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none"
                        placeholder="Tell us what's on your mind..."
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                      size="lg"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Send Message
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      We respect your privacy. Read our{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        privacy policy
                      </Link>
                    </p>
                  </form>
                )}
              </div>

              {/* Other ways to reach us */}
              <div className="mt-8 p-6 rounded-lg bg-primary/5 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-3">Other Ways to Reach Us</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• <strong>Bug Reports:</strong> support@photogenerator.ai</li>
                  <li>• <strong>Feature Requests:</strong> support@photogenerator.ai</li>
                  <li>• <strong>Privacy Concerns:</strong> support@photogenerator.ai</li>
                  <li>• <strong>Business Inquiries:</strong> support@photogenerator.ai</li>
                </ul>
              </div>
            </div>

            {/* ── FAQ Section ───────────────────────────────────────────────────
              This is what the "View FAQ" button (above) scrolls to.
              FAQSection renders an accordion using ui/accordion.tsx.
            ─────────────────────────────────────────────────────────────────── */}
            <div id="faq" className="mt-16">
              <FAQSection
                title="Frequently Asked Questions"
                description="Everything you need to know about PhotoGenerator.ai"
                items={FAQ_ITEMS}
              />
            </div>

          </div>
        </GradientSection>
      </main>

      <Footer />
    </div>
  )
}
