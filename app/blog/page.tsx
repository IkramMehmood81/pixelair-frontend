/**
 * app/blog/page.tsx — Blog list page (Server Component with ISR)
 *
 * Route: /blog
 * Renders all published GoHighLevel blog posts with SEO metadata.
 * Revalidates every 5 minutes via Next.js ISR.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Calendar, Clock, User, ArrowRight, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GradientSection } from "@/components/gradient-section";
import { fetchBlogs, formatDate, estimateReadTime, type BlogSummary } from "@/lib/blog-api";

// ── Next.js ISR — revalidate every 5 minutes ──────────────────────────────────
export const revalidate = 300;

// ── Static SEO metadata ────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: "Blog — PhotoGenerator.ai",
  description:
    "Tips, tutorials, and insights on AI image enhancement, photography, and creative workflows from the PhotoGenerator.ai team.",
  openGraph: {
    title: "Blog — PhotoGenerator.ai",
    description:
      "Tips, tutorials, and insights on AI image enhancement, photography, and creative workflows.",
    type: "website",
    siteName: "PhotoGenerator.ai",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog — PhotoGenerator.ai",
    description: "Tips and tutorials on AI image enhancement from PhotoGenerator.ai.",
  },
};

// ── Blog card component ────────────────────────────────────────────────────────

function BlogCard({ blog }: { blog: BlogSummary }) {
  return (
    <Link
      href={`/blog/${blog.slug}`}
      className="group flex flex-col rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1"
    >
      {/* Featured image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {blog.featuredImage ? (
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-accent/20">
            <BookOpen className="w-12 h-12 text-primary/40" />
          </div>
        )}
        {/* Category pill */}
        {blog.categories.length > 0 && (
          <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold bg-primary/90 text-primary-foreground backdrop-blur-sm">
            {blog.categories[0]}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-5 sm:p-6 gap-3">
        <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {blog.title}
        </h2>

        {blog.excerpt && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
            {blog.excerpt}
          </p>
        )}

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-2 border-t border-border">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(blog.publishedAt)}
          </span>
          {blog.author && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              {blog.author}
            </span>
          )}
          <span className="flex items-center gap-1 ml-auto text-primary font-medium">
            Read more
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyBlogs() {
  return (
    <div className="text-center py-24 space-y-6">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
        <BookOpen className="w-10 h-10 text-primary/50" />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-foreground">No posts yet</h2>
        <p className="text-muted-foreground max-w-sm mx-auto">
          We're working on some great content. Check back soon!
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
      >
        <ArrowRight className="w-4 h-4 rotate-180" /> Back to home
      </Link>
    </div>
  );
}

// ── Error fallback ─────────────────────────────────────────────────────────────

function BlogError({ message }: { message: string }) {
  return (
    <div className="text-center py-24 space-y-4">
      <p className="text-muted-foreground">{message}</p>
      <Link href="/" className="text-primary hover:underline font-medium">
        Return home
      </Link>
    </div>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────────

export default async function BlogListPage() {
  let blogs: BlogSummary[] = [];
  let error: string | null = null;

  try {
    const data = await fetchBlogs(revalidate);
    blogs = data.blogs;
  } catch (err) {
    error =
      err instanceof Error
        ? err.message
        : "Could not load blog posts. Please try again later.";
    console.error("[BlogListPage] fetch error:", err);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-background via-background to-card/30">
          <div className="absolute inset-0 -z-10 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-xs font-medium text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              PhotoGenerator.ai Blog
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground leading-tight">
              Tips, Tutorials &amp;{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Insights
              </span>
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-light">
              AI image enhancement guides, photography tips, and creative
              workflow tutorials from the PhotoGenerator.ai team.
            </p>
          </div>
        </section>

        {/* Blog grid */}
        <GradientSection>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {error ? (
              <BlogError message={error} />
            ) : blogs.length === 0 ? (
              <EmptyBlogs />
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-8">
                  {blogs.length} article{blogs.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                  {blogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              </>
            )}
          </div>
        </GradientSection>
      </main>
      <Footer />
    </div>
  );
}
