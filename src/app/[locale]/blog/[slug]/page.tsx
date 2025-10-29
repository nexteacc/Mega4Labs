import { getPostBySlug, getAllPosts, getRelatedPosts } from "@/lib/blog";
import { resolveLocale, LOCALES, type Locale } from "@/lib/i18n";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { BlogCard } from "@/components/BlogCard";
import Link from "next/link";

type BlogPostPageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateStaticParams() {
  const params = [];
  for (const locale of LOCALES) {
    const posts = await getAllPosts(locale);
    for (const post of posts) {
      params.push({ locale, slug: post.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocale(localeParam);
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishDate,
      authors: [post.author],
      images: post.image ? [post.image] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { locale: localeParam, slug } = await params;
  const locale = resolveLocale(localeParam);
  const post = await getPostBySlug(locale, slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(locale, slug);

  const backLabels: Record<Locale, string> = {
    en: "← Back to Blog",
    ko: "← 블로그로 돌아가기",
    ja: "← ブログに戻る",
    zh: "← 返回博客",
  };

  const relatedLabels: Record<Locale, string> = {
    en: "Related Articles",
    ko: "관련 글",
    ja: "関連記事",
    zh: "相关文章",
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-6 py-12 sm:px-8 lg:px-10">
      {/* Back Button */}
      <Link
        href={`/${locale}/blog`}
        className="mb-8 inline-flex items-center text-sm text-secondary hover:text-primary transition-colors"
      >
        {backLabels[locale]}
      </Link>

      {/* Article Header */}
      <article className="mx-auto max-w-[800px]">
        <header className="mb-8">
          <h1 className="mb-4 text-4xl font-bold text-primary sm:text-5xl">
            {post.title}
          </h1>
          <div className="flex flex-wrap items-center gap-4 text-sm text-secondary">
            <span>{post.author}</span>
            <span>•</span>
            <time dateTime={post.publishDate}>{post.publishDate}</time>
            <span>•</span>
            <span>{post.readingTime}</span>
          </div>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-hero px-3 py-1 text-xs font-medium text-accent"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: post.content || "" }}
        />
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mx-auto mt-16 max-w-[1180px]">
          <h2 className="mb-8 text-2xl font-bold text-primary">
            {relatedLabels[locale]}
          </h2>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {relatedPosts.map((relatedPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} locale={locale} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
