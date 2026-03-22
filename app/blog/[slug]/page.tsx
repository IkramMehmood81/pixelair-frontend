/**
 * app/blog/[slug]/page.tsx
 *
 * GHL HTML structure (from backend BeautifulSoup extraction):
 * ──────────────────────────────────────────────────────────────
 * The backend fetches {GHL_PREVIEW_BASE}/post-preview/{slug} and extracts
 * [class*="blog-content"]. That div contains:
 *
 *   1. Category badge  — <a class="*category*">dummy</a>
 *   2. Meta bar        — date + "X min read" text
 *   3. Actual content  — paragraphs, images, headings
 *   4. Author block    — div[class*="blog-author"] at the bottom:
 *                          <img class="blog-author-image-post" src="...">
 *                          <a href="/v2/preview/.../author/ID">Name</a>
 *                          <p>Bio...</p>
 *   5. "Back to Blog"  — anchor with that text
 *
 * We:
 *   A. EXTRACT author name/bio/photo from the author block before stripping
 *   B. STRIP items 1, 2, 4, 5 from the content so they don't render twice
 *   C. Show author card at bottom linking to /blog/[slug]/author
 */

import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, User, Tag, ArrowLeft, Clock, BookOpen } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { GradientSection } from "@/components/gradient-section";
import {
  fetchBlogBySlug,
  formatDate,
  estimateReadTime,
  type BlogDetail,
} from "@/lib/blog-api";

export const revalidate = 60;
export const dynamicParams = true;
export async function generateStaticParams() { return []; }

// ── SEO metadata ───────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  try {
    const blog = await fetchBlogBySlug(slug, 60);
    const title = blog.metaTitle || blog.title;
    const description = blog.metaDescription || blog.excerpt || "Read this article on PhotoGenerator.ai";
    const imageUrl = blog.featuredImage ?? undefined;
    return {
      title: `${title} — PhotoGenerator.ai`,
      description,
      openGraph: {
        title, description, type: "article",
        publishedTime: blog.publishedAt,
        modifiedTime: blog.updatedAt ?? undefined,
        authors: blog.author ? [blog.author] : undefined,
        images: imageUrl ? [{ url: imageUrl, alt: title }] : undefined,
        siteName: "PhotoGenerator.ai",
      },
      twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : undefined },
    };
  } catch {
    return { title: "Blog Post — PhotoGenerator.ai", description: "Read the latest from PhotoGenerator.ai" };
  }
}

// ── Author data types ──────────────────────────────────────────────────────────
export interface ExtractedAuthor {
  name:      string | null;
  bio:       string | null;
  photo:     string | null;
  facebook:  string | null;
  twitter:   string | null;
  linkedin:  string | null;
  instagram: string | null;
  youtube:   string | null;
}

// ── Extract author from GHL HTML ───────────────────────────────────────────────
// GHL author block uses class="blog-author-*" pattern.
// The author link is a full absolute path: href="/v2/preview/.../author/ID"
export function extractAuthorFromHtml(html: string): ExtractedAuthor {
  const empty: ExtractedAuthor = {
    name: null, bio: null, photo: null,
    facebook: null, twitter: null, linkedin: null, instagram: null, youtube: null,
  };

  // Find the author block by GHL's class pattern
  const authorBlockMatch = html.match(
    /<(?:div|section)[^>]*class="[^"]*blog-author[^"]*"[^>]*>([\s\S]*?)<\/(?:div|section)>/i
  );

  // Also try a broader match — GHL sometimes uses different wrappers
  const authorArea = authorBlockMatch
    ? authorBlockMatch[0]
    : (() => {
        // Fallback: find the area around the /author/ link (GHL preview path)
        const idx = html.search(/href="[^"]*\/author\/[^"]+"/i);
        if (idx === -1) return "";
        return html.slice(Math.max(0, idx - 1500), idx + 1500);
      })();

  if (!authorArea) return empty;

  // 1. Name — text content of the /author/ link
  const nameMatch = authorArea.match(
    /href="[^"]*\/author\/[^"]*"[^>]*>\s*([^<]{2,80}?)\s*<\/a>/i
  );
  const name = nameMatch ? nameMatch[1].trim() : null;

  // 2. Photo — img with blog-author-image class (GHL's specific class)
  const photoMatch =
    authorArea.match(/<img[^>]*class="[^"]*blog-author-image[^"]*"[^>]*src="(https?:\/\/[^"]+)"/i) ||
    authorArea.match(/src="(https?:\/\/[^"]+)"[^>]*class="[^"]*blog-author-image[^"]*"/i) ||
    authorArea.match(/<img[^>]*class="[^"]*(?:author|avatar)[^"]*"[^>]*src="(https?:\/\/[^"]+)"/i);
  const photo = photoMatch ? photoMatch[1] : null;

  // 3. Bio — clean text from <p> tags in author area, strictly filtering HTML garbage
  let bio: string | null = null;
  const pMatches = authorArea.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) ?? [];
  for (const p of pMatches) {
    const text = p
      .replace(/<[^>]+>/g, "")           // strip all tags
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    // Reject if: too short, looks like HTML attributes, or is a URL fragment
    if (
      text.length < 15 ||
      /(?:href|src|class|loading|width|height)\s*=/.test(text) ||
      /v2\/preview/.test(text) ||
      /^[\W\d\s]{0,5}$/.test(text)
    ) continue;
    bio = text;
    break;
  }

  // 4. Social links — scan full HTML for known platforms
  const facebook  = html.match(/href="(https?:\/\/(?:www\.)?facebook\.com\/[^"\s>]+)"/i)?.[1] ?? null;
  const twitter   = html.match(/href="(https?:\/\/(?:www\.)?(?:twitter|x)\.com\/[^"\s>]+)"/i)?.[1] ?? null;
  const linkedin  = html.match(/href="(https?:\/\/(?:www\.)?linkedin\.com\/[^"\s>]+)"/i)?.[1] ?? null;
  const instagram = html.match(/href="(https?:\/\/(?:www\.)?instagram\.com\/[^"\s>]+)"/i)?.[1] ?? null;
  const youtube   = html.match(/href="(https?:\/\/(?:www\.)?youtube\.com\/[^"\s>]+)"/i)?.[1] ?? null;

  return { name, bio, photo, facebook, twitter, linkedin, instagram, youtube };
}

// ── Strip GHL injected chrome from content ─────────────────────────────────────
// GHL injects into the blog-content div:
//   - Category badge at top
//   - Date + read-time meta bar
//   - Author block at bottom (div[class*="blog-author"])
//   - "Back to Blog" / "Back to Top" links
//   - Featured image (we already show it above)
function sanitizeHtml(raw: string, featuredImageUrl: string | null, authorName?: string): string {
  let html = raw;

  // 1. Strip duplicate H1
  html = html.replace(/<h1[^>]*>[\s\S]*?<\/h1>/gi, "");

  // 2. Strip GHL author block — div with class containing "blog-author"
  html = html.replace(
    /<(?:div|section)[^>]*class="[^"]*blog-author[^"]*"[^>]*>[\s\S]*?<\/(?:div|section)>/gi,
    ""
  );

  // 3. Strip fallback — everything from /author/ link to end (in case class didn't match)
  const authorHrefIdx = html.search(/href="[^"]*\/author\/[^"]+"/i);
  if (authorHrefIdx !== -1) {
    // Walk back max 2000 chars to find the containing div
    const before = html.slice(Math.max(0, authorHrefIdx - 2000), authorHrefIdx);
    const lastDiv = before.lastIndexOf("<div");
    const lastSection = before.lastIndexOf("<section");
    const cutBack = Math.max(lastDiv, lastSection);
    const cutPoint = cutBack !== -1
      ? Math.max(0, authorHrefIdx - 2000) + cutBack
      : authorHrefIdx;
    html = html.slice(0, cutPoint);
  }

  // 4b. If author name is known, strip any remaining plain-text author block
  // GHL sometimes renders author name as plain text outside any wrapper
  if (authorName) {
    // Find the last occurrence of the author name as plain text
    const nameIdx = html.lastIndexOf(authorName);
    if (nameIdx !== -1) {
      // Check if it's inside a tag or truly plain text
      const before = html.slice(Math.max(0, nameIdx - 200), nameIdx);
      // If preceded by </a> or </p> or </div> it's a standalone text node
      if (/>\s*$/.test(before)) {
        // Walk back to find the enclosing div
        const searchBack = html.slice(Math.max(0, nameIdx - 1000), nameIdx);
        const lastDiv = searchBack.lastIndexOf("<div");
        if (lastDiv !== -1) {
          const cutPoint = Math.max(0, nameIdx - 1000) + lastDiv;
          html = html.slice(0, cutPoint);
        }
      }
    }
  }

  // 4. Strip "Back to Blog" / "Back to Top" links
  html = html.replace(/<a[^>]*>[^<]*Back to (?:Blog|Top)[^<]*<\/a>/gi, "");
  html = html.replace(/Back to (?:Blog|Top)/gi, "");

  // 5. Strip GHL category badges (anchor with class containing "category")
  html = html.replace(/<a[^>]*class="[^"]*categor[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "");

  // 6. Strip GHL meta bar (date + read time injected at top of content)
  // Pattern: small div/p containing date-like text and "min read"
  html = html.replace(
    /<(?:div|p|span)[^>]*>[^<]*\d{4}[^<]*(?:min read|minute read)[^<]*<\/(?:div|p|span)>/gi,
    ""
  );

  // 7. Strip featured image duplicate
  if (featuredImageUrl) {
    const tail = featuredImageUrl.slice(-50).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      html = html.replace(
        new RegExp("<figure[^>]*>[\\s\\S]{0,500}?" + tail + "[\\s\\S]{0,200}?<\\/figure>", "gi"),
        ""
      );
      html = html.replace(new RegExp("<img[^>]*" + tail + "[^>]*>", "gi"), "");
    } catch { /* skip */ }
  }

  // 7b. Strip inline color styles that GHL injects (they override our dark theme)
  html = html.replace(/\s*color\s*:\s*(?:#[0-9a-fA-F]{3,6}|rgb[^;)"']+|[a-z]+)\s*;?/gi, "");
  html = html.replace(/\s*background-color\s*:[^;)"']+;?/gi, "");
  html = html.replace(/\s*background\s*:\s*(?:#[0-9a-fA-F]{3,6}|rgb[^;)"']+|[a-z]+)\s*;?/gi, "");

  // 8. Security — remove scripts, styles, iframes
  html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
  html = html.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "");
  html = html.replace(/<\/?(?:iframe|object|embed)\b[^>]*>/gi, "");
  html = html.replace(/\s+on\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "");
  html = html.replace(/href\s*=\s*"javascript:[^"]*"/gi, 'href="#"');

  // 9. Rewrite remaining GHL internal links
  html = html.replace(
    /href\s*=\s*"[^"]*\/(?:author|category|tag|blog-author|blog-category|blog-tag)\/[^"]*"/gi,
    'href="/blog"'
  );

  return html.trim();
}

// ── Blog content renderer ──────────────────────────────────────────────────────
function BlogContent({ html, featuredImage, authorName }: { html: string; featuredImage: string | null; authorName?: string }) {
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
        prose-hr:border-border prose-strong:text-foreground prose-li:text-foreground/80
        [&_*]:!color-inherit
      "
      style={{ color: 'inherit' }}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html, featuredImage, authorName) }}
    />
  );
}

// ── Inline SVG social icons ────────────────────────────────────────────────────
function FacebookIcon()  { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>; }
function XIcon()         { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>; }
function LinkedInIcon()  { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>; }
function InstagramIcon() { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>; }
function YoutubeIcon()   { return <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46a2.78 2.78 0 0 0-1.95 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.96-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/></svg>; }

// ── Author card (bottom of post, links to /author page) ───────────────────────
function AuthorCard({ name, slug, author }: {
  name: string;
  slug: string;
  author: ExtractedAuthor;
}) {
  const socials = [
    author.facebook  ? { href: author.facebook,  label: "Facebook",  Icon: FacebookIcon  } : null,
    author.twitter   ? { href: author.twitter,   label: "X",         Icon: XIcon         } : null,
    author.linkedin  ? { href: author.linkedin,  label: "LinkedIn",  Icon: LinkedInIcon  } : null,
    author.instagram ? { href: author.instagram, label: "Instagram", Icon: InstagramIcon } : null,
    author.youtube   ? { href: author.youtube,   label: "YouTube",   Icon: YoutubeIcon   } : null,
  ].filter(Boolean) as { href: string; label: string; Icon: () => React.ReactElement }[];

  return (
    <div className="mt-12 pt-8 border-t border-border">
      <Link
        href={`/blog/${slug}/author`}
        className="block rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors group"
      >
        <div className="flex items-center gap-4">
          {author.photo ? (
            <img
              src={author.photo}
              alt={name}
              className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 flex-shrink-0"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center flex-shrink-0">
              <User className="w-7 h-7 text-primary/40" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">Written by</p>
            <p className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">{name}</p>
            {author.bio && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{author.bio}</p>
            )}
          </div>
          <ArrowLeft className="w-4 h-4 text-muted-foreground rotate-180 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
        </div>
        {socials.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border" onClick={(e) => e.preventDefault()}>
            {socials.map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 transition-colors"
              >
                <Icon />{label}
              </a>
            ))}
          </div>
        )}
      </Link>
    </div>
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
    if (msg.includes("not found") || msg.includes("not yet published")) notFound();
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4 py-24 px-4">
            <BookOpen className="w-12 h-12 text-primary/30 mx-auto" />
            <h1 className="text-2xl font-bold text-foreground">Could not load post</h1>
            <p className="text-muted-foreground">{err instanceof Error ? err.message : "Please try again later."}</p>
            <Link href="/blog" className="text-primary hover:underline font-medium">← Back to blog</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const readTime = estimateReadTime(blog.content);

  // Extract author from this post's specific HTML content
  // Each blog post has its own content fetched from GHL preview URL for that slug
  const extracted = extractAuthorFromHtml(blog.content);

  // Use extracted name first, fallback to API author field
  const authorName = extracted.name || blog.author;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1">

        {/* Featured image */}
        {blog.featuredImage && (
          <div className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden bg-muted">
            <img src={blog.featuredImage} alt={blog.title} className="w-full h-full object-cover" loading="eager" />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-transparent" />
          </div>
        )}

        <GradientSection className={blog.featuredImage ? "pt-8 sm:pt-12" : ""}>
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Back to blog list */}
            <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-8 group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              All articles
            </Link>

            {/* Categories */}
            {blog.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {blog.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1 rounded-full text-xs font-semibold bg-primary/15 text-primary border border-primary/20">
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
              {authorName && (
                <Link
                  href={`/blog/${slug}/author`}
                  className="flex items-center gap-1.5 hover:text-primary transition-colors"
                >
                  {extracted.photo ? (
                    <img src={extracted.photo} alt={authorName} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  {authorName}
                </Link>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {readTime}
              </span>
            </div>

            {/* Blog content — GHL chrome stripped */}
            {blog.content ? (
              <BlogContent html={blog.content} featuredImage={blog.featuredImage} authorName={authorName ?? undefined} />
            ) : (
              <p className="text-foreground/80 leading-relaxed">
                {blog.excerpt || "Content coming soon."}
              </p>
            )}

            {/* Tags */}
            {blog.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-border">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  {blog.tags.map((tag) => (
                    <span key={tag} className="px-2.5 py-1 rounded-md text-xs text-muted-foreground bg-muted border border-border">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author card */}
            {authorName && (
              <AuthorCard name={authorName} slug={slug} author={extracted} />
            )}

            {/* Back to blog */}
            <div className="mt-8 pt-8 border-t border-border text-center">
              <Link href="/blog" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors border border-primary/20">
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