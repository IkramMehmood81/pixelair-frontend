import type { Metadata } from 'next'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { GradientSection } from '@/components/gradient-section'

export const metadata: Metadata = {
  title: 'About Us — PhotoGenerator.ai',
  description:
    'We built PhotoGenerator.ai so that getting high-quality photos is free, fast, and simple — no paywalls, no sign-up required.',
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        <GradientSection className="pt-8 sm:pt-10 pb-16 sm:pb-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-24">

            {/* Hero heading */}
            <div className="mb-12 sm:mb-16">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                About PhotoGenerator.ai
              </h1>
              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed">
                We built PhotoGenerator.ai for one simple reason.
              </p>
              <p className="text-lg sm:text-xl text-foreground/80 leading-relaxed mt-3">
                Getting high-quality photos shouldn't be expensive, complicated, or locked behind
                paywalls.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-4">
                There are already powerful tools out there, but most of them charge for basic
                features like enhancing images. We didn't think that made sense. Not everyone has
                access to professional cameras, perfect lighting, or editing software — and they
                shouldn't be held back because of that.
              </p>
              <p className="text-base text-muted-foreground leading-relaxed mt-4">
                So we created something different. A free, fast, and simple way to enhance your
                photos using AI.
              </p>
            </div>

            <div className="space-y-14 sm:space-y-16">

              {/* Why we exist */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Why we exist</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Photos don't always come out the way you want. They can be blurry, low quality,
                  poorly lit, or just missing that sharp, professional look. That's where we come in.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-3">
                  PhotoGenerator.ai is built to take what you already have and make it better.
                  Sharper, clearer, more vibrant, and ready to use wherever you need it.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-3">
                  Whether it's for social media, business, content creation, or personal use — we
                  help turn everyday photos into something you're actually proud to share.
                </p>
              </section>

              {/* What makes us different */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-6">
                  What makes us different
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  We focus on what actually matters to you:
                </p>

                <div className="space-y-4">
                  {[
                    {
                      title: 'Completely free',
                      body: 'You can enhance your photos without paying. No subscriptions, no hidden charges.',
                    },
                    {
                      title: 'No sign-up required',
                      body: 'Just upload your image and get results instantly.',
                    },
                    {
                      title: 'Fast results',
                      body: 'Most images are enhanced in seconds.',
                    },
                    {
                      title: 'Privacy first',
                      body: 'Your images are not stored. They are processed and automatically removed.',
                    },
                    {
                      title: 'High-quality AI enhancement',
                      body: 'We focus on real improvements — sharper details, better lighting, cleaner images.',
                    },
                  ].map(({ title, body }) => (
                    <div
                      key={title}
                      className="p-5 rounded-xl border border-border bg-card hover:border-primary/40 transition-colors"
                    >
                      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
                    </div>
                  ))}
                </div>

                <p className="text-base text-muted-foreground leading-relaxed mt-6">
                  We don't make money from charging you to use the tool. Instead, we keep the
                  platform running through ads, so you can keep coming back and using it whenever
                  you need.
                </p>
              </section>

              {/* Built for real people */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Built for real people
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Not everyone is a professional photographer.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-3">
                  Most people are just trying to get a better version of a photo they already have.
                  Maybe it's a picture you want to post, send, or use for work.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-3">
                  We built PhotoGenerator.ai for those moments.{' '}
                  <span className="text-foreground font-medium">Simple. Fast. No friction.</span>
                </p>
              </section>

              {/* Where we're going */}
              <section>
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  Where we're going
                </h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  Enhancing photos is just the start.
                </p>
                <p className="text-base text-muted-foreground leading-relaxed mt-3">
                  We're working on tools that go beyond improving your images. Soon, you'll be able
                  to transform your photos into high-end, professional visuals inspired by fashion,
                  marketing, and editorial photography.
                </p>
                <p className="text-sm font-medium text-foreground mt-4 mb-3">Think:</p>
                <ul className="space-y-2 ml-4">
                  {['Vogue-style images', 'Studio-quality visuals', 'High-end marketing shots'].map(
                    (item) => (
                      <li key={item} className="flex items-center gap-2 text-base text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                        {item}
                      </li>
                    ),
                  )}
                </ul>
                <p className="text-base text-muted-foreground leading-relaxed mt-4">
                  All powered by AI, and still simple to use.
                </p>
              </section>

              {/* Our goal */}
              <section className="p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/20">
                <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">Our goal</h2>
                <p className="text-base text-muted-foreground leading-relaxed">
                  To make powerful photo tools accessible to everyone.
                </p>
                <p className="text-lg font-semibold text-foreground mt-4">
                  No paywalls. No complexity. No barriers.
                </p>
                <p className="text-xl font-bold text-primary mt-2">Just better photos, instantly.</p>
              </section>

            </div>
          </div>
        </GradientSection>
      </main>

      <Footer />
    </div>
  )
}