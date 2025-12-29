# Mega 4 Labs

AI 行业领袖访谈视频聚合平台，展示 OpenAI、Cursor、DeepMind 和 Anthropic 四大公司领导者的访谈、演讲和见解。

## 功能特性

- 🎯 **四大 AI 公司** - OpenAI、Cursor、DeepMind、Anthropic
- 👥 **行业领袖** - Sam Altman、Dario Amodei、Demis Hassabis 等
- 🌟 **Hero 精选** - 自动选择高质量热门视频
- 📊 **智能过滤** - 播放量、点赞率、发布时间多维度筛选
- 🚀 **自动抓取** - YouTube 视频自动抓取脚本
- 🚀 **自动抓取** - YouTube 视频自动抓取脚本

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

创建 `.env.local` 文件：

```bash
# YouTube API Key (用于视频抓取)
YOUTUBE_API_KEY=your_youtube_api_key_here

# Google Analytics 4 (可选，用于用户跟踪)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 3. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```bash
npm run build
npm start
```

## 视频抓取

### 抓取 YouTube 视频

```bash
npm run fetch-videos
```

**抓取策略：**
- 每个语言市场 3 次搜索（Tutorial、ProReview、Shorts）
- Hero 从其他类别精选 Top 4
- 自动去重，确保类别互斥
- 质量筛选：观看数、点赞率、发布时间

**配置文件：** `config/youtube-search.ts`

详细说明：查看 `docs/video-fetching-logic.md`

## 用户行为跟踪

### Google Analytics 4 设置

1. 创建 [Google Analytics](https://analytics.google.com/) 账号
2. 获取 Measurement ID (格式: `G-XXXXXXXXXX`)
3. 添加到 `.env.local`:
   ```bash
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   ```
4. 部署后自动开始跟踪

**跟踪的事件：**
- `cta_click` - CTA 按钮点击
- `video_play` - 视频播放
- `language_switch` - 语言切换

详细说明：查看 `docs/google-analytics-setup.md`

## 项目结构

```
.
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React 组件
│   ├── data/            # 静态数据（FAQ、视频等）
│   ├── hooks/           # 自定义 Hooks
│   └── lib/             # 工具函数
├── config/              # 配置文件
│   └── youtube-search.ts # 视频抓取配置
├── scripts/             # 脚本
│   └── fetch-youtube-videos.ts # 视频抓取脚本
├── docs/                # 文档
│   ├── google-analytics-setup.md
│   └── video-fetching-logic.md
└── public/              # 静态资源
```

## 技术栈

- **框架：** Next.js 16 (App Router)
- **语言：** TypeScript
- **样式：** Tailwind CSS 4
- **分析：** Google Analytics 4
- **部署：** Vercel
- **视频：** YouTube API

## 开发指南

### 添加新语言

1. 在 `src/lib/i18n.ts` 中添加语言代码
2. 在 `src/data/` 中添加翻译文件
3. 在 `config/youtube-search.ts` 中添加搜索配置
4. 运行 `npm run fetch-videos` 抓取视频

### 修改视频抓取逻辑

编辑 `config/youtube-search.ts`:

```typescript
export const SEARCH_QUERIES: SearchQuery[] = [
  {
    query: "your search keyword",
    category: "tutorial",
    locale: "en",
    maxResults: 30,
    minDuration: 120,
    maxDuration: 600,
  },
  // ...
];
```

### 自定义分析事件

在 `src/hooks/useAnalytics.ts` 中添加新事件类型：

```typescript
type AnalyticsEvent = 
  | "video_play" 
  | "cta_click" 
  | "language_switch"
  | "your_new_event";
```

然后在组件中使用：

```typescript
const { track } = useAnalytics();
track("your_new_event", { custom: "data" });
```

## 部署

### Vercel (推荐)

1. 推送代码到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 添加环境变量：
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
4. 部署

### 其他平台

```bash
npm run build
npm start
```

确保设置环境变量。

## 文档

- [Google Analytics 设置指南](docs/google-analytics-setup.md)
- [视频抓取逻辑说明](docs/video-fetching-logic.md)
- [Analytics 跟踪指南](docs/analytics-tracking.md)

## 许可证

MIT

## 支持

有问题？查看文档或提交 Issue。
