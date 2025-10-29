import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import type { Locale } from "./i18n";

export type BlogPost = {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
  author: string;
  publishDate: string;
  category: string;
  tags: string[];
  image?: string;
  content?: string;
  readingTime?: string;
};

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * 计算阅读时间（基于字数）
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * 获取所有博客文章
 */
export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
  const localeDir = path.join(CONTENT_DIR, locale);

  // 如果目录不存在，返回空数组
  if (!fs.existsSync(localeDir)) {
    return [];
  }

  const files = fs.readdirSync(localeDir).filter((file) => file.endsWith(".md"));

  const posts = files.map((filename) => {
    const slug = filename.replace(/\.md$/, "");
    const filePath = path.join(localeDir, filename);
    const fileContents = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(fileContents);

    return {
      slug,
      locale,
      title: data.title || "Untitled",
      description: data.description || "",
      author: data.author || "Anonymous",
      publishDate: data.publishDate || new Date().toISOString().split("T")[0],
      category: data.category || "general",
      tags: data.tags || [],
      image: data.image,
      readingTime: calculateReadingTime(content),
    };
  });

  // 按发布日期排序（最新的在前）
  return posts.sort(
    (a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  );
}

/**
 * 根据 slug 获取单篇文章
 */
export async function getPostBySlug(
  locale: Locale,
  slug: string
): Promise<BlogPost | null> {
  const filePath = path.join(CONTENT_DIR, locale, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  // 将 Markdown 转换为 HTML
  const processedContent = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(content);

  const contentHtml = processedContent.toString();

  return {
    slug,
    locale,
    title: data.title || "Untitled",
    description: data.description || "",
    author: data.author || "Anonymous",
    publishDate: data.publishDate || new Date().toISOString().split("T")[0],
    category: data.category || "general",
    tags: data.tags || [],
    image: data.image,
    content: contentHtml,
    readingTime: calculateReadingTime(content),
  };
}

/**
 * 获取相关文章（基于分类和标签）
 */
export async function getRelatedPosts(
  locale: Locale,
  currentSlug: string,
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getAllPosts(locale);
  const currentPost = allPosts.find((post) => post.slug === currentSlug);

  if (!currentPost) {
    return allPosts.slice(0, limit);
  }

  // 简单的相关性算法：相同分类或标签
  const related = allPosts
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      let score = 0;
      if (post.category === currentPost.category) score += 2;
      const commonTags = post.tags.filter((tag) => currentPost.tags.includes(tag));
      score += commonTags.length;
      return { post, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.post);

  return related;
}
