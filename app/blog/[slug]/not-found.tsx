import Link from "next/link";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export default function BlogNotFound() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-6 px-4 py-24">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10">
            <BookOpen className="w-10 h-10 text-primary/50" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Post not found</h1>
            <p className="text-muted-foreground max-w-sm mx-auto">
              This article doesn't exist or hasn't been published yet.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            <ArrowLeft className="w-4 h-4" /> Back to blog
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
