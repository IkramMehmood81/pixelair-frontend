import Link from 'next/link'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <article className="prose prose-sm max-w-none">
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Use</h1>
          <p className="text-muted-foreground mb-8">Last updated: March 2024</p>

          <section className="space-y-6 text-foreground">
            <div>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using ProEnhance, you accept and agree to be bound by the terms of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                Permission is granted to temporarily download one copy of the materials (information or software) on ProEnhance for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to decompile or reverse engineer any software contained on ProEnhance</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials on ProEnhance are provided "as is". ProEnhance makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">4. Limitations</h2>
              <p className="text-muted-foreground leading-relaxed">
                In no event shall ProEnhance or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on ProEnhance.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">5. Accuracy of Materials</h2>
              <p className="text-muted-foreground leading-relaxed">
                The materials appearing on ProEnhance could include technical, typographical, or photographic errors. ProEnhance does not warrant that any of the materials on our website are accurate, complete, or current.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">6. Materials & Content</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                The materials on ProEnhance are protected by intellectual property laws. You may not:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Reproduce or transmit any content without permission</li>
                <li>Use content for unlawful or prohibited purposes</li>
                <li>Violate any laws or third-party rights</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">7. Upload Content License</h2>
              <p className="text-muted-foreground leading-relaxed">
                You retain all rights to images you upload. By uploading content, you grant ProEnhance a license to process, store temporarily, and enhance your images. You warrant that you own or have permission to use all uploaded content.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">8. Prohibited Uses</h2>
              <p className="text-muted-foreground leading-relaxed mb-3">
                You may not use ProEnhance to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Upload illegal or copyrighted content without permission</li>
                <li>Generate spam, malware, or harmful content</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with service operations</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">9. File Size & Rate Limits</h2>
              <p className="text-muted-foreground leading-relaxed">
                ProEnhance enforces file size limits (10MB maximum) and rate limiting to ensure fair service for all users. Attempts to circumvent these limits may result in service suspension.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">10. Service Modifications</h2>
              <p className="text-muted-foreground leading-relaxed">
                ProEnhance reserves the right to modify or discontinue the service at any time, with or without notice. We will not be liable for any modification, suspension, or discontinuation of the service.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">11. Third-Party Links</h2>
              <p className="text-muted-foreground leading-relaxed">
                ProEnhance may contain links to third-party websites. We are not responsible for the content, accuracy, or practices of these external sites. Your use of them is at your own risk and subject to their terms.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">12. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                ProEnhance reserves the right to terminate access to its service at any time for violations of these terms or for any reason deemed necessary.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">13. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed">
                These terms and conditions are governed by and construed in accordance with applicable laws, and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about these Terms of Use, please contact us at <Link href="mailto:legal@proenhance.app" className="text-primary hover:underline">legal@proenhance.app</Link>
              </p>
            </div>

            <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mt-8">
              <h3 className="font-semibold text-foreground mb-2">Last Revision</h3>
              <p className="text-sm text-muted-foreground">
                These Terms of Use were last revised on March 2024. We reserve the right to update these terms at any time.
              </p>
            </div>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  )
}
