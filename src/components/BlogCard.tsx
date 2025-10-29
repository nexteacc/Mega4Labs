import Link from "next/link";
import type { BlogPost } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";

type BlogCardProps = {
  post: BlogPost;
  locale: Locale;
};

export function BlogCard({ post, locale }: BlogCardProps) {
  return (
    <Link
      href={`/${locale}/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-panel transition-all hover:border-accent hover:shadow-lg"
    >
      {post.image && (
        <div className="aspect-video w-full overflow-hidden bg-hero">
          <img
            src={post.image}
            alt={post.title}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex items-center gap-2 text-xs text-secondary">
          <span className="rounded-full bg-hero px-2 py-1 font-medium text-accent">
            {post.category}
          </span>
          <span>•</span>
          <time dateTime={post.publishDate}>{post.publishDate}</time>
        </div>
        <h3 className="mb-2 text-xl font-bold text-primary group-hover:text-accent transition-colors">
          {post.title}
        </h3>
        <p className="mb-4 flex-1 text-sm text-secondary line-clamp-3">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span>{post.author}</span>
          <span>{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
