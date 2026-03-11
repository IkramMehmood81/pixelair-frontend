import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 2024</p>

          <section className="space-y-6 text-foreground">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai ("we," "us," or "our") operates the image enhancement service at photogenerator.ai. This Privacy Policy explains our practices regarding data collection and protection.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Information We Collect</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Images You Upload</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Images uploaded to PhotoGenerator.ai are processed by our AI enhancement service. We do not store personal information or images longer than necessary for processing.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Technical Information</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    We automatically collect certain technical information including IP addresses, browser type, pages visited, and timestamps. This data helps us improve service reliability and security.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. How We Use Your Information</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Process and enhance your images</li>
                <li>Monitor service performance and security</li>
                <li>Prevent fraud and abuse</li>
                <li>Comply with legal obligations</li>
                <li>Improve user experience and service quality</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Data Retention & Deletion</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong>All uploaded images are automatically deleted within 24 hours.</strong> We do not retain or store your images on our servers beyond this timeframe. Enhanced images are also automatically purged.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Metadata Stripping</h2>
              <p className="text-muted-foreground leading-relaxed">
                We automatically remove all EXIF metadata from your images, including location data, camera information, and timestamps. This protects your privacy and sensitive information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Cookies & Tracking</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai uses minimal cookies only for essential functionality and analytics. We do not use cookies for advertising or tracking purposes. You can disable cookies in your browser settings.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                We use third-party services including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li><strong>Google AdSense</strong> for advertising (subject to Google's privacy policy)</li>
                <li><strong>Analytics providers</strong> for aggregated usage statistics</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Security</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement industry-standard security measures including HTTPS encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed">
                PhotoGenerator.ai is not intended for children under 13. We do not knowingly collect personal information from children. If we become aware of such collection, we will take steps to delete such information.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">10. Your Rights</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You have the right to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Access information about your data</li>
                <li>Request deletion of your data</li>
                <li>Opt-out of analytics collection</li>
                <li>Request a copy of your data</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We may update this Privacy Policy periodically. We will notify you of material changes by updating the "Last updated" date. Continued use of PhotoGenerator.ai after changes constitutes acceptance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this Privacy Policy or our privacy practices, please contact us at <Link href="mailto:privacy@photogenerator.ai" className="text-primary hover:underline">privacy@photogenerator.ai</Link>
              </p>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-foreground mb-2">GDPR & Privacy Laws</h3>
              <p className="text-sm text-muted-foreground">
                PhotoGenerator.ai complies with GDPR, CCPA, and other privacy regulations. We do not sell your data. Your privacy is our priority.
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
