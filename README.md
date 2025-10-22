# Comet × Perplexity Learning Hub Landing Page

一个基于 Next.js 16 App Router 打造的教育型落地页 Demo，通过精选多语言视频内容引导用户了解 Comet 浏览器与 Perplexity AI 的组合价值，并推动邀请码注册转化。

## ✨ 关键特性
- **多语言与 GEO 友好**：支持 `en / ko / ja / zh` 多语言路由，根路径自动重定向默认语言，后续可扩展自动语言识别。
- **SEO 优化**：SSG/ISR 输出、结构化数据 (`VideoObject` / `ItemList` JSON-LD)、`hreflang` 与 OpenGraph/Twitter Meta 自动生成。
- **视频内容模块化**：Hero 精选 + Tutorial / Demo / Pro Review / Shorts 四大板块，卡片化呈现，支持模块内 CTA。
- **交互体验**：自定义视频弹窗、语言切换器、渐进式 CTA 布局，保留后续埋点与 A/B 测试的接口。
- **数据层抽象**：`src/data/videos.ts` 模拟多语言内容，后续可接入 YouTube Data API / CMS；`lib/content` 提供按语言/分类聚合，并实现 fallback 策略。

## 🏗️ 技术栈
- **框架**：Next.js 16 (App Router, React Server Components)
- **语言**：TypeScript
- **样式**：TailwindCSS + 自定义主题变量
- **字体**：Vercel Geist Sans & Mono
- **构建工具**：ESLint、TypeScript、Vercel / Node 运行时兼容

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

## 🔄 内容数据
- 目前使用 `src/data/videos.ts` 作为静态示例，包含英文为主、辅以韩/日/中文若干条目。
- `lib/content.ts` 会根据传入 `locale` 自动挑选对应语言视频；若缺失则回退到默认 `en` 内容。
- 未来可将该文件替换为：
  - CMS（Contentful/Sanity/Hygraph 等）
  - YouTube Data API + KV/数据库缓存
  - 后台管理系统导出的 JSON

## 📈 埋点与数据收集
- `useAnalytics` 当前仅在开发环境 `console.log`，并向 `window` 派发自定义事件 `analytics:*`。
- 可在真实部署时接入 GA4、PostHog、Segment 等，或自建 API 收集 `video_play` / `cta_click` / `language_switch`。
- 埋点参数包含视频 ID、分类、语言、CTA 位置等，方便后续做漏斗分析与内容排序优化。

## 📌 后续扩展建议
1. **真实数据**：接入 YouTube API，按频道/关键字同步数据并缓存；为每个模块新增排序权重。
2. **多语言完善**：补充韩/日/中文更多视频、文案及本地化标题；可根据 GEO 自动默认对应语言。
3. **高级 SEO**：生成 sitemap / robots.txt，增加 FAQ / 博文条目提升长尾关键词覆盖。
4. **A/B 测试**：在 Hero 或模块顺序上集成实验框架（Vercel A/B、Optimizely 等）。
5. **部署**：推荐部署到 Vercel（或其他支持 Edge/ISR 的平台），结合边缘函数做语言识别与缓存。

---

如要继续拓展功能或接入真实数据，可在 `TODO` 章节中记录任务，并逐项推进。欢迎提 Issue / PR。