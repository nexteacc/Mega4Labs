import { getAllPosts } from "@/lib/blog";
import { resolveLocale, type Locale } from "@/lib/i18n";
import { BlogCard } from "@/components/BlogCard";
import type { Metadata } from "next";

type BlogPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);

  const titles: Record<Locale, string> = {
    en: "Blog - Comet & Perplexity Learning Hub",
    ko: "블로그 - Comet & Perplexity 학습 센터",
    ja: "ブログ - Comet & Perplexity ラーニングハブ",
    zh: "博客 - Comet & Perplexity 学习中心",
  };

  const descriptions: Record<Locale, string> = {
    en: "Tutorials, tips, and insights about Comet Browser and Perplexity AI",
    ko: "Comet 브라우저와 Perplexity AI에 대한 튜토리얼, 팁, 인사이트",
    ja: "Comet ブラウザと Perplexity AI に関するチュートリアル、ヒント、インサイト",
    zh: "关于 Comet 浏览器和 Perplexity AI 的教程、技巧和见解",
  };

  return {
    title: titles[locale],
    description: descriptions[locale],
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { locale: localeParam } = await params;
  const locale = resolveLocale(localeParam);
  const posts = await getAllPosts(locale);

  const headings: Record<Locale, string> = {
    en: "Blog",
    ko: "블로그",
    ja: "ブログ",
    zh: "博客",
  };

  const subheadings: Record<Locale, string> = {
    en: "Tutorials, tips, and insights about Comet Browser and Perplexity AI",
    ko: "Comet 브라우저와 Perplexity AI에 대한 튜토리얼, 팁, 인사이트",
    ja: "Comet ブラウザと Perplexity AI に関するチュートリアル、ヒント、インサイト",
    zh: "关于 Comet 浏览器和 Perplexity AI 的教程、技巧和见解",
  };

  const emptyMessages: Record<Locale, string> = {
    en: "No blog posts available yet. Check back soon!",
    ko: "아직 블로그 게시물이 없습니다. 곧 확인하세요!",
    ja: "まだブログ記事がありません。近日公開予定です！",
    zh: "暂无博客文章。敬请期待！",
  };

  return (
    <div className="mx-auto w-full max-w-[1180px] px-4 py-8 sm:px-8 sm:py-12 lg:px-10">
      <div className="mb-8 text-center sm:mb-12">
        <h1 className="mb-3 text-3xl font-bold text-primary break-words sm:mb-4 sm:text-4xl lg:text-5xl">
          {headings[locale]}
        </h1>
        <p className="text-base text-secondary break-words sm:text-lg">{subheadings[locale]}</p>
      </div>

      {posts.length === 0 ? (
        <div className="py-16 text-center text-sm text-secondary sm:py-20 sm:text-base">
          {emptyMessages[locale]}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-8">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
