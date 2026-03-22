/**
 * app/blog/[slug]/author/page.tsx
 * Route: /blog/:slug/author
 * Shows author card for the post's author.
 * Back arrow returns to that exact blog post.
 */

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GradientSection } from "@/components/gradient-section";
import { fetchBlogBySlug } from "@/lib/blog-api";
import { extractAuthorFromHtml, type ExtractedAuthor } from "@/app/blog/[slug]/page";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await fetchBlogBySlug(slug, 60);
    const extracted = extractAuthorFromHtml(blog.content);
    const name = extracted.name || blog.author || "Author";
    return {
      title: `${name} — PhotoGenerator.ai`,
      description: extracted.bio || `Posts by ${name} on PhotoGenerator.ai`,
    };
  } catch {
    return { title: "Author — PhotoGenerator.ai" };
  }
}

// ── Inline SVG social icons ────────────────────────────────────────────────────
function FacebookIcon()  { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function XIcon()         { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function LinkedInIcon()  { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }
function InstagramIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>; }
function YoutubeIcon()   { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>; }

// ── Page ───────────────────────────────────────────────────────────────────────
export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let author: ExtractedAuthor;
  let fallbackName: string | null = null;

  try {
    // Fetch with refresh=true to bypass backend cache and get post-specific content
    const blog = await fetchBlogBySlug(slug, 60);
    author = extractAuthorFromHtml(blog.content);
    fallbackName = blog.author;
  } catch {
    notFound();
  }

  const name = author.name || fallbackName;
  if (!name) notFound();

  const hasDetails = !!(author.bio || author.photo || author.facebook ||
    author.twitter || author.linkedin || author.instagram || author.youtube);

  const socials = [
    author.facebook  ? { href: author.facebook,  label: "Facebook",  Icon: FacebookIcon  } : null,
    author.twitter   ? { href: author.twitter,   label: "X",         Icon: XIcon         } : null,
    author.linkedin  ? { href: author.linkedin,  label: "LinkedIn",  Icon: LinkedInIcon  } : null,
    author.instagram ? { href: author.instagram, label: "Instagram", Icon: InstagramIcon } : null,
    author.youtube   ? { href: author.youtube,   label: "YouTube",   Icon: YoutubeIcon   } : null,
  ].filter(Boolean) as { href: string; label: string; Icon: () => React.ReactElement }[];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        <GradientSection className="pt-8 sm:pt-12 pb-16 sm:pb-24">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back to the specific blog post */}
            <Link
              href={`/blog/${slug}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-10 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to article
            </Link>

            <div className="rounded-2xl border border-border bg-card p-8 sm:p-10 space-y-6">

              {/* Photo + Name */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                {author.photo ? (
                  <img
                    src={author.photo}
                    alt={name!}
                    className="w-28 h-28 rounded-full object-cover border-4 border-primary/20 flex-shrink-0"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-primary/10 border-4 border-primary/20 flex items-center justify-center flex-shrink-0">
                    <User className="w-12 h-12 text-primary/40" />
                  </div>
                )}
                <div className="text-center sm:text-left space-y-1 pt-1">
                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{name}</h1>
                  <p className="text-sm text-muted-foreground">Author</p>
                </div>
              </div>

              {/* Bio */}
              {author.bio && (
                <div className="pt-4 border-t border-border">
                  <p className="text-foreground/80 leading-relaxed">{author.bio}</p>
                </div>
              )}

              {/* Social links */}
              {socials.length > 0 && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-3">Follow</p>
                  <div className="flex flex-wrap gap-2">
                    {socials.map(({ href, label, Icon }) => (
                      <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
                      >
                        <Icon />{label}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* No details fallback */}
              {!hasDetails && (
                <div className="pt-4 border-t border-border text-center py-6">
                  <User className="w-10 h-10 text-primary/20 mx-auto mb-3" />
                  <p className="text-muted-foreground text-sm">
                    No additional details available for this author yet.
                  </p>
                  <p className="text-muted-foreground/60 text-xs mt-1">
                    Add a photo, bio, and social links in GoHighLevel to show them here.
                  </p>
                </div>
              )}

            </div>
          </div>
        </GradientSection>
      </main>
      <Footer />
    </div>
  );
}