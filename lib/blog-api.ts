/**
 * lib/blog-api.ts
 *
 * Typed fetch wrapper for the FastAPI /blogs endpoints.
 * Calls YOUR backend — never GoHighLevel directly.
 *
 * Error handling
 * ──────────────
 * All functions return gracefully on error:
 *   fetchBlogs()       → { blogs: [], total: 0, cached: false }  (never throws)
 *   fetchBlogBySlug()  → throws (caller uses notFound() or shows error state)
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:8000";

// ── Types ──────────────────────────────────────────────────────────────────────

export interface BlogSummary {
  id: string;
  title: string;
  slug: string;
  featuredImage: string | null;
  publishedAt: string;
  excerpt: string | null;
  author: string | null;
  categories: string[];
}

export interface BlogAuthor {
  name: string | null;
  photo: string | null;       // URL to author photo
  bio: string | null;         // Author description
  canonicalLink: string | null;
  facebook: string | null;
  twitter: string | null;     // "x" in GHL
  linkedin: string | null;
  instagram: string | null;
  youtube: string | null;
}

export interface BlogDetail extends BlogSummary {
  content: string;
  updatedAt: string | null;
  tags: string[];
  metaTitle: string | null;
  metaDescription: string | null;
  authorDetails: BlogAuthor | null;  // full author object from GHL
}

export interface BlogListResponse {
  blogs: BlogSummary[];
  total: number;
  cached: boolean;
}

// ── Internal fetch helper ─────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const message =
      (body as { detail?: string; error?: string }).detail ||
      (body as { detail?: string; error?: string }).error ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return res.json() as Promise<T>;
}

// ── Public API ─────────────────────────────────────────────────────────────────

/**
 * Fetch all published blogs from the backend.
 *
 * NEVER throws — returns an empty list on any error so the blog page
 * shows "No posts yet" instead of crashing.
 * `revalidate` drives Next.js ISR (default 5 min).
 */
export async function fetchBlogs(revalidate = 60): Promise<BlogListResponse> {
  try {
    return await apiFetch<BlogListResponse>("/blogs", {
      next: { revalidate },
    });
  } catch (err) {
    // Log server-side; return empty state to the page
    console.error("[fetchBlogs] failed:", err instanceof Error ? err.message : err);
    return { blogs: [], total: 0, cached: false };
  }
}

/**
 * Fetch a single blog post by slug.
 * Throws on 404 (caller should call notFound()) or network errors.
 */
export async function fetchBlogBySlug(
  slug: string,
  revalidate = 60,
): Promise<BlogDetail> {
  // Each slug is cached independently on the backend under "blog:slug:{slug}".
  // next: { revalidate } tells Next.js to revalidate this fetch every 60s (ISR).
  // This means production pages load fast from cache and stay fresh automatically.
  return apiFetch<BlogDetail>(`/blogs/${encodeURIComponent(slug)}`, {
    next: { revalidate },
  });
}

/**
 * Invalidate the backend blog cache.
 * Call after publishing or updating a post in GoHighLevel.
 * Protected by a shared secret to prevent unauthorized cache busting.
 */
export async function invalidateBlogCache(): Promise<void> {
  await fetch(`${API_BASE}/blogs/cache`, {
    method: "DELETE",
    headers: {
      "x-cache-secret": process.env.CACHE_INVALIDATION_SECRET ?? "",
    },
  });
}

// ── Formatting helpers ─────────────────────────────────────────────────────────

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]+>/g, "").split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}