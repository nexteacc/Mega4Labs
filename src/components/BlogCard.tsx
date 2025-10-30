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
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-panel transition-all hover:border-accent hover:shadow-lg sm:rounded-2xl"
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
      <div className="flex flex-1 flex-col p-4 sm:p-6">
        <div className="mb-2 flex items-center gap-2 text-xs text-secondary sm:mb-3">
          <span className="rounded-full bg-hero px-2 py-1 font-medium text-accent truncate">
            {post.category}
          </span>
          <span>•</span>
          <time dateTime={post.publishDate} className="truncate">{post.publishDate}</time>
        </div>
        <h3 className="mb-2 text-lg font-bold text-primary group-hover:text-accent transition-colors break-words sm:text-xl">
          {post.title}
        </h3>
        <p className="mb-3 flex-1 text-xs text-secondary line-clamp-3 break-words sm:mb-4 sm:text-sm">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-secondary">
          <span className="truncate">{post.author}</span>
          <span className="flex-shrink-0">{post.readingTime}</span>
        </div>
      </div>
    </Link>
  );
}
