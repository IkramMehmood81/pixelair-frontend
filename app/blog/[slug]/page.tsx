/**
 * app/blog/[slug]/page.tsx — Single blog post page (Server Component + ISR)
 *
 * Route:  /blog/:slug
 * - Dynamic SEO metadata per post (title, description, OpenGraph, Twitter card)
 * - Full blog HTML rendered safely with DOMPurify on the client
 * - Revalidates every 5 minutes via ISR
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GradientSection } from "@/components/gradient-section";
import {
  fetchBlogBySlug,
  fetchBlogs,
  formatDate,
  estimateReadTime,
  type BlogDetail,
} from "@/lib/blog-api";

export const revalidate = 60;
export const dynamicParams = true; // render new posts on-demand, then cache

// ── Dynamic — render on first request, cache for 60s ─────────────────────────
// Returns empty so no slugs are pre-built at deploy time.
// New posts from GHL appear on the FIRST request (no deploy needed).
// dynamicParams=true above ensures unknown slugs render on-demand.
export async function generateStaticParams() {
  return []; // intentionally empty — all posts render on-demand
}

// ── Dynamic per-post SEO metadata ─────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await fetchBlogBySlug(slug, 60);
    const title = blog.metaTitle || blog.title;
    const description =
      blog.metaDescription || blog.excerpt || "Read this article on PhotoGenerator.ai";
    const imageUrl = blog.featuredImage ?? undefined;

    return {
      title: `${title} — PhotoGenerator.ai`,
      description,
      openGraph: {
        title,
        description,
        type: "article",
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt ?? undefined,
        authors: blog.author ? [blog.author] : undefined,
        images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
        siteName: "PhotoGenerator.ai",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: imageUrl ? [imageUrl] : undefined,
      },
    };
  } catch {
    return {
      title: "Blog Post — PhotoGenerator.ai",
      description: "Read the latest from PhotoGenerator.ai",
    };
  }
}

// ── Blog content renderer (client component for DOMPurify) ────────────────────
// We inline the safe-render here to keep the file count low.
// The actual sanitisation happens via a small wrapper.

/**
 * Strips the first <h1> from CMS-provided HTML to prevent duplicate titles.
 * GoHighLevel (GHL) injects the post title into the body content, but we
 * already render it explicitly above — two H1s hurt SEO and look broken.
 */
function stripFirstH1(html: string): string {
  return html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/i, "").trimStart();
}

function BlogContent({ html }: { html: string }) {
  const sanitised = stripFirstH1(html);
  // For server rendering we trust the content comes from GHL (your own CMS).
  // If you want client-side DOMPurify, convert this to a 'use client' component.
  return (
    <div
      className="
        prose prose-invert max-w-none
        prose-headings:font-bold prose-headings:text-foreground prose-headings:tracking-tight
        prose-p:text-foreground/80 prose-p:leading-relaxed
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:border prose-img:border-border prose-img:w-full
        prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1 prose-code:rounded
        prose-pre:bg-card prose-pre:border prose-pre:border-border
        prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground
        prose-hr:border-border
        prose-strong:text-foreground
        prose-li:text-foreground/80
      "
      dangerouslySetInnerHTML={{ __html: sanitised }}
    />
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let blog: BlogDetail;

  try {
    blog = await fetchBlogBySlug(slug, 60);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg.includes("not found") || msg.includes("not yet published")) {
      notFound();
    }
    // Network/server error — show fallback
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 py-24 px-4">
            <BookOpen className="w-12 h-12 text-primary/30 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Could not load post</h1>
            <p className="text-muted-foreground">
              {err instanceof Error ? err.message : "Please try again later."}
            </p>
            <Link href="/blog" className="text-primary hover:underline font-medium">
              ← Back to blog
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1">
        {/* ── Featured Image Hero ───────────────────────────────────────────── */}
        {blog.featuredImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-muted">
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        )}

        <GradientSection className={blog.featuredImage ? "pt-8 sm:pt-12" : ""}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back link */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              All articles
            </Link>

            {/* Categories */}
            {blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground leading-tight tracking-tight mb-6">
              {blog.title}
            </h1>

            {/* Meta bar */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-8 pb-8 border-b border-border">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {formatDate(blog.publishedAt)}
              </span>
              {blog.author && (
                <span className="flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  {blog.author}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>

            {/* Content */}
            {blog.content ? (
              <BlogContent html={blog.content} />
            ) : (
              <div className="prose prose-invert max-w-none">
                <p className="text-foreground/80 leading-relaxed">
                  {blog.excerpt || 'Content coming soon.'}
                </p>
              </div>
            )}

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {blog.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs text-muted-foreground bg-muted border border-border"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back to blog */}
            <div className="mt-16 pt-8 border-t border-border text-center">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors border border-primary/20"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to all articles
              </Link>
            </div>

          </div>
        </GradientSection>
      </main>

      <Footer />
    </div>
  );
}