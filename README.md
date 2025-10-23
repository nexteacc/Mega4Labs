# Comet × Perplexity Learning Hub

一个基于 Next.js 16 App Router 打造的多语言视频学习平台，通过精选 YouTube 视频内容引导用户了解 Comet 浏览器与 Perplexity AI 的功能与价值，并推动 Pro 版本注册转化。

**线上地址**: https://www.perplexitypro.info

## ✨ 核心特性

### 多语言支持
- 支持 `en / ko / ja / zh` 四种语言路由
- 根路径自动重定向到默认语言（英文）
- 每个语言版本独立的 SEO 优化（title、description、keywords）
- hreflang 标签自动生成，帮助搜索引擎识别语言版本

### SEO 深度优化
- **SSG/ISR 渲染**：6 小时自动重新生成，确保内容新鲜度
- **结构化数据**：
  - `VideoObject` + `ItemList` JSON-LD（视频列表）
  - `WebSite` Schema（网站信息）
  - `Organization` Schema（组织信息）
- **Meta 标签完整**：keywords、author、robots、theme-color
- **社交分享优化**：OpenGraph 标签、OG Image 配置
- **sitemap.xml**：自动生成多语言站点地图
- **robots.txt**：搜索引擎爬取规则
- **PWA 支持**：manifest.json，可添加到主屏幕

### 视频内容模块化
- **Hero 精选**：首屏展示 4 个精选视频
- **Tutorial 教程**：分步指南和实战教学
- **Pro Review 专业测评**：深度评测与对比分析
- **Shorts 快速上手**：1 分钟速学技巧
- 卡片化呈现，支持模块内 CTA 按钮

### 交互体验
- 自定义视频播放弹窗（YouTube iframe）
- 语言切换器（支持 4 种语言）
- 渐进式 CTA 布局（Hero、中间、底部）
- 响应式设计，移动端友好

### 数据与分析
- **Vercel Analytics**：页面访问量、来源、设备统计
- **自定义埋点**：`useAnalytics` hook，支持事件追踪
- **YouTube 数据同步**：`npm run fetch-videos` 自动抓取最新视频

## 🏗️ 技术栈
- **框架**：Next.js 16 (App Router, React Server Components, React 19)
- **语言**：TypeScript 5
- **样式**：TailwindCSS 4 + 自定义 CSS 变量
- **字体**：Vercel Geist Sans & Mono
- **分析**：Vercel Analytics
- **工具**：ESLint、tsx、Zod（数据验证）

## 📁 目录结构概览
```
src/
├── app/
│   ├── layout.tsx              # 全局布局、字体与主题
│   ├── page.tsx                # 根路径重定向到默认语言
│   └── [locale]/
│       ├── layout.tsx          # 多语言头部 + 语言切换器
│       └── page.tsx            # 主页面：Hero、模块、CTA、SEO
├── components/                 # UI 组件（Hero、VideoGrid、CTA、Modal 等）
├── data/videos.ts              # Mock 视频数据（多语言示例）
├── hooks/useAnalytics.ts       # 轻量埋点 hook，后续可对接 GA4 / PostHog
├── lib/
│   ├── content.ts              # 内容聚合与 fallback 策略
│   ├── format.ts               # 时长/日期/URL 格式化工具
│   ├── i18n.ts                 # 多语言文案与枚举
│   └── seo.ts                  # Meta 与 JSON-LD 构建工具
└── app/globals.css             # 全局主题变量与基础样式
```

## 🚀 本地开发
```bash
# 安装依赖
npm install

# 启动开发服务器（http://localhost:3000）
npm run dev
```

### 代码质量检查
```bash
npm run lint   # ESLint 检查
npm run build  # 生产构建（验证多语言 SSG 输出与 TypeScript 类型）
```

## 🔄 视频数据管理

### 当前实现
- **数据源**：`src/data/videos.ts`（61 个视频，自动生成）
- **数据同步**：运行 `npm run fetch-videos` 从 YouTube API 抓取最新视频
- **多语言支持**：视频按 `locale` 字段分类（en/ko/ja/zh）
- **分类系统**：hero（精选）、tutorial（教程）、proReview（测评）、shorts（短视频）
- **Fallback 策略**：`lib/content.ts` 自动处理语言缺失，回退到英文内容

### 数据结构
```typescript
{
  id: string;           // YouTube 视频 ID
  locale: Locale;       // 语言版本
  category: Category;   // 分类
  title: string;        // 标题
  description: string;  // 描述
  channelTitle: string; // 频道名称
  publishDate: string;  // 发布日期
  duration: string;     // 时长（ISO 8601）
  thumbnail: {...};     // 缩略图
  tags: string[];       // 标签
}
```

### 未来扩展
- 接入 CMS（Contentful/Sanity）实现可视化管理
- 添加视频排序权重和推荐算法
- 缓存策略优化（Redis/KV）

## 📈 数据分析

### Vercel Analytics（已集成）
- **基础数据**：页面访问量、独立访客、来源分析
- **设备统计**：桌面/移动端/平板占比
- **地理位置**：访客国家/地区分布
- **查看位置**：Vercel Dashboard → 项目 → Analytics

### 自定义事件追踪
- **useAnalytics Hook**：
  - `video_play`：视频播放事件
  - `cta_click`：CTA 按钮点击
  - `language_switch`：语言切换
- **开发环境**：console.log 输出
- **生产环境**：派发 `window` 自定义事件
- **扩展方向**：可接入 Google Analytics 4、PostHog、Plausible

## 🎯 SEO 优化清单

### ✅ 已完成
- [x] robots.txt 和 sitemap.xml
- [x] 多语言关键词（每语言 10 个）
- [x] Meta 标签完整（keywords、author、robots、theme-color）
- [x] 结构化数据（VideoObject、WebSite、Organization）
- [x] OpenGraph 社交分享标签
- [x] hreflang 多语言标签
- [x] PWA manifest.json
- [x] 性能优化（preconnect YouTube）
- [x] Favicon 配置（32x32、16x16、Apple Touch Icon）

### ⏳ 待完成
- [ ] 创建 OG Image（1200x630px）
- [ ] Google Search Console 验证
- [ ] 提交 sitemap 到 Google/Bing
- [ ] 添加 FAQ Schema（如有需要）
- [ ] 性能监控（Core Web Vitals）

## 📌 部署与维护

### 部署平台
- **推荐**：Vercel（自动 CI/CD，支持 ISR）
- **配置**：
  - 环境变量：`YOUTUBE_API_KEY`（用于视频同步）
  - 构建命令：`npm run build`
  - 输出目录：`.next`

### 维护频率
- **内容更新**：每周运行 `npm run fetch-videos` 同步新视频
- **SEO 检查**：每月查看 Google Search Console 数据
- **性能监控**：每月查看 Vercel Analytics
- **代码更新**：根据需求迭代功能

### 监控指标
- 页面加载速度（< 3 秒）
- SEO 排名变化
- 转化率（CTA 点击率）
- 视频播放完成率

---

## 🚀 快速开始

需要帮助？查看 [部署指南](#部署与维护) 或提交 Issue。