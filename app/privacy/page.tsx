import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export const metadata = {
  title: 'Privacy Policy — PhotoGenerator.ai',
  description: 'Read the PhotoGenerator.ai privacy policy covering data collection, cookies, advertising, and your rights.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: April 2025</p>

          <section className="space-y-8 text-foreground">

            {/* 1. Introduction */}
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai (&ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) operates the AI image enhancement
                service at photogenerator.ai. This Privacy Policy explains what data we collect,
                how we use it, how we share it, and your rights regarding that data — including
                data collected through advertising partners such as Google AdSense.
              </p>
            </div>

            {/* 2. Information We Collect */}
            <div>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Images You Upload</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Images uploaded to PhotoGenerator.ai are sent to our AI enhancement service
                    for processing only. We do not store, log, or retain uploaded images after
                    processing is complete. All images are automatically deleted immediately
                    after your enhanced result is generated.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical &amp; Usage Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We automatically collect certain technical information including IP addresses,
                    browser type and version, pages visited, timestamps, and referring URLs. This
                    helps us monitor service reliability, security, and performance.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Cookies &amp; Tracking Technologies</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We use cookies and similar technologies (web beacons, pixel tags) for the
                    following purposes:
                  </p>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mt-3">
                    <li><strong>Essential cookies</strong> — required for the site to function (e.g. your cookie consent preference).</li>
                    <li><strong>Analytics cookies</strong> — help us understand how visitors use the site (e.g. Vercel Analytics).</li>
                    <li><strong>Advertising cookies</strong> — placed by Google AdSense and its partners to serve personalised ads based on your browsing history, <em>only if you have given consent</em>. If you decline cookies, only essential cookies are used and no advertising cookies are placed.</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-3">
                    You can withdraw or change your cookie consent at any time by clicking
                    &ldquo;Manage Cookies&rdquo; in the footer, or by clearing your browser cookies and
                    reloading the page.
                  </p>
                </div>
              </div>
            </div>

            {/* 3. How We Use Your Information */}
            <div>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Process and enhance your uploaded images</li>
                <li>Monitor service performance, reliability, and security</li>
                <li>Prevent fraud, abuse, and violations of our Terms of Use</li>
                <li>Serve advertisements that help us keep the service free</li>
                <li>Improve user experience and service quality</li>
                <li>Comply with applicable legal obligations</li>
              </ul>
            </div>

            {/* 4. Advertising — Google AdSense */}
            <div id="advertising">
              <h2 className="text-2xl font-bold mb-4">4. Advertising — Google AdSense</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                PhotoGenerator.ai is funded by advertising. We use <strong>Google AdSense</strong> to
                display ads on this site. Google and its partners may use cookies, web beacons,
                and similar technologies to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li>Serve ads based on your prior visits to this and other websites (interest-based advertising)</li>
                <li>Measure ad performance and prevent fraudulent clicks</li>
                <li>Report aggregate statistics to advertisers</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Google&apos;s use of advertising cookies enables it and its partners to serve ads
                based on your visits to this site and/or other sites on the internet.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-3">
                <strong>Ads are always shown</strong> — they fund free access to this tool.
                If you <strong>accept</strong> cookies, ads are personalised to your interests
                (higher relevance, better experience). If you <strong>decline</strong>, ads are
                still shown but in non-personalised mode — based on page content only, with
                no personal tracking cookies placed on your device. This is fully GDPR compliant.
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p>You may opt out of personalised advertising at any time by visiting:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>
                    <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Google Ad Settings
                    </a>
                  </li>
                  <li>
                    <a href="https://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Digital Advertising Alliance opt-out
                    </a>
                  </li>
                  <li>
                    <a href="https://www.youronlinechoices.eu/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Your Online Choices (EU)
                    </a>
                  </li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed mt-4">
                To learn more about how Google uses data when you use our site, visit:{' '}
                <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  How Google uses data when you use our partners&apos; sites or apps
                </a>.
              </p>
            </div>

            {/* 5. Data Retention */}
            <div>
              <h2 className="text-2xl font-bold mb-4">5. Data Retention &amp; Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>Uploaded images are deleted immediately after processing.</strong> We do
                not retain or store your images on our servers beyond the time required for
                enhancement. Enhanced output images are also purged immediately after download.
                Technical log data (IP addresses, timestamps) may be retained for up to 30 days
                for security and abuse-prevention purposes, then deleted.
              </p>
            </div>

            {/* 6. Metadata Stripping */}
            <div>
              <h2 className="text-2xl font-bold mb-4">6. Metadata Stripping</h2>
              <p className="text-muted-foreground leading-relaxed">
                We automatically remove all EXIF metadata from your images before processing,
                including GPS location data, camera model information, and timestamps, protecting
                your privacy.
              </p>
            </div>

            {/* 7. Third-Party Services */}
            <div>
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use the following third-party services which may collect data subject to their
                own privacy policies:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>
                  <strong>Google AdSense</strong> — advertising (
                  <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Privacy Policy</a>)
                </li>
                <li>
                  <strong>Vercel Analytics</strong> — privacy-friendly, aggregated usage analytics (
                  <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vercel Privacy Policy</a>)
                </li>
                <li>
                  <strong>Replicate / AI processing backend</strong> — image enhancement processing only; images are not stored by the provider after processing
                </li>
              </ul>
            </div>

            {/* 8. Security */}
            <div>
              <h2 className="text-2xl font-bold mb-4">8. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures including HTTPS/TLS encryption
                for all data in transit, secure server infrastructure, and Content Security
                Policy headers. No method of transmission over the internet is 100% secure, but
                we take all reasonable precautions to protect your data.
              </p>
            </div>

            {/* 9. Children's Privacy */}
            <div>
              <h2 className="text-2xl font-bold mb-4">9. Children&apos;s Privacy (COPPA)</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai is not directed at children under the age of 13. We do not
                knowingly collect personal information from children under 13. If you believe we
                have inadvertently collected such information, please contact us immediately and
                we will delete it promptly. Our advertising is tagged to indicate it is not
                directed at children as required by COPPA.
              </p>
            </div>

            {/* 10. Your Rights */}
            <div>
              <h2 className="text-2xl font-bold mb-4">10. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Depending on your location, you may have the following rights regarding your data:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Right to access information about your data</li>
                <li>Right to request deletion of your data</li>
                <li>Right to object to or restrict processing</li>
                <li>Right to opt out of personalised advertising (see Section 4)</li>
                <li>Right to data portability</li>
                <li>Right to withdraw cookie consent at any time</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mt-3">
                To exercise any of these rights, contact us at{' '}
                <Link href="mailto:privacy@photogenerator.ai" className="text-primary hover:underline">
                  privacy@photogenerator.ai
                </Link>.
              </p>
            </div>

            {/* 11. GDPR */}
            <div>
              <h2 className="text-2xl font-bold mb-4">11. GDPR &amp; International Privacy Laws</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai complies with the EU General Data Protection Regulation (GDPR),
                the UK GDPR, the California Consumer Privacy Act (CCPA), and other applicable
                privacy laws. We do not sell your personal data to third parties. Our legal basis
                for processing data for advertising purposes is your explicit consent, which you
                provide via our cookie consent banner.
              </p>
            </div>

            {/* 12. Changes */}
            <div>
              <h2 className="text-2xl font-bold mb-4">12. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of
                material changes by updating the &ldquo;Last updated&rdquo; date at the top of this page.
                Continued use of PhotoGenerator.ai after changes constitutes acceptance of the
                updated policy.
              </p>
            </div>

            {/* 13. Contact */}
            <div>
              <h2 className="text-2xl font-bold mb-4">13. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, contact
                us at{' '}
                <Link href="mailto:privacy@photogenerator.ai" className="text-primary hover:underline">
                  privacy@photogenerator.ai
                </Link>.
              </p>
            </div>

            {/* Summary box */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-foreground mb-3">Summary</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li> Images deleted immediately after processing — never stored</li>
                <li> Ads always show — they keep the tool free for everyone</li>
                <li> Accept → personalised ads (relevant to your interests)</li>
                <li> Decline → non-personalised ads (contextual only, no tracking cookies)</li>
                <li> We never sell your personal data</li>
                <li> GDPR, CCPA, and COPPA compliant</li>
              </ul>
            </div>

          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}