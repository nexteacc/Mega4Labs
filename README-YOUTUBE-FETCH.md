# YouTube 视频自动抓取系统

## 快速开始

### 1. 获取 YouTube API Key

1. 访问 [Google Cloud Console](https://console.cloud.google.com/)
2. 创建新项目或选择现有项目
3. 启用 **YouTube Data API v3**
4. 创建凭据 → API 密钥
5. 复制 API Key

### 2. 配置环境变量

```bash
# 复制示例文件
cp .env.example .env.local

# 编辑 .env.local，填入你的 API Key
YOUTUBE_API_KEY=AIzaSy...your_key_here
```

### 3. 安装依赖

```bash
npm install
```

### 4. 运行抓取脚本

```bash
npm run fetch-videos
```

脚本会自动：
- ✅ 根据关键词搜索 YouTube 视频
- ✅ 获取视频详细信息（时长、观看数、点赞数）
- ✅ 质量筛选（过滤低质量视频）
- ✅ 自动分类（hero/tutorial/demo/proReview/shorts）
- ✅ 去重和排序
- ✅ 生成 `src/data/videos.ts` 文件

---

## 配置说明

### 修改搜索关键词

编辑 `config/youtube-search.ts`：

```typescript
export const SEARCH_QUERIES: SearchQuery[] = [
  {
    query: "Comet browser tutorial",  // 搜索关键词
    category: "tutorial",              // 分类
    locale: "en",                      // 语言
    maxResults: 10,                    // 最多返回数量
    minDuration: 300,                  // 最短时长（秒）
  },
  // 添加更多搜索...
];
```

### 修改质量筛选规则

编辑 `config/youtube-search.ts`：

```typescript
export const QUALITY_FILTERS = {
  minViewCount: 500,        // 最少观看数
  minLikeRatio: 0.7,        // 最低点赞率
  maxAgeInDays: 365,        // 最多1年内的视频
  excludeKeywords: [        // 排除关键词
    "clickbait",
    "scam",
  ],
};
```

---

## API 配额说明

YouTube Data API v3 免费配额：**10,000 单位/天**

操作成本：
- 搜索视频：100 单位/次
- 获取视频详情：1 单位/视频

**示例计算：**
- 10 次搜索（每次 10 个结果）= 1,000 单位
- 获取 100 个视频详情 = 100 单位
- **总计：1,100 单位**（远低于每日配额）

---

## 自动化更新

### 方案 1：手动运行

每次需要更新时运行：
```bash
npm run fetch-videos
npm run build
```

### 方案 2：定时任务（推荐）

使用 GitHub Actions 每天自动更新：

```yaml
# .github/workflows/update-videos.yml
name: Update YouTube Videos

on:
  schedule:
    - cron: '0 0 * * *'  # 每天 UTC 00:00
  workflow_dispatch:      # 手动触发

jobs:
  update:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run fetch-videos
        env:
          YOUTUBE_API_KEY: ${{ secrets.YOUTUBE_API_KEY }}
      - run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add src/data/videos.ts
          git commit -m "chore: update videos" || exit 0
          git push
```

### 方案 3：Vercel Cron Jobs

在 `vercel.json` 中配置：

```json
{
  "crons": [{
    "path": "/api/update-videos",
    "schedule": "0 0 * * *"
  }]
}
```

---

## 故障排查

### 错误：未设置 YOUTUBE_API_KEY

```bash
export YOUTUBE_API_KEY=your_key_here
npm run fetch-videos
```

### 错误：API 配额超限

等待第二天配额重置，或升级到付费计划。

### 错误：搜索结果为空

检查关键词是否正确，或放宽筛选条件。

---

## 高级用法

### 只抓取特定分类

修改 `config/youtube-search.ts`，注释掉不需要的搜索：

```typescript
export const SEARCH_QUERIES: SearchQuery[] = [
  // 只保留 tutorial
  {
    query: "Comet browser tutorial",
    category: "tutorial",
    locale: "en",
    maxResults: 20,
  },
  // 其他的注释掉...
];
```

### 添加新语言

```typescript
{
  query: "Comet navegador tutorial",  // 西班牙语
  category: "tutorial",
  locale: "es",  // 需要先在 i18n.ts 中添加
  maxResults: 5,
}
```

---

## 注意事项

1. **不要提交 API Key** - `.env.local` 已在 `.gitignore` 中
2. **遵守 API 配额** - 避免频繁运行脚本
3. **定期更新** - 建议每天或每周运行一次
4. **检查结果** - 运行后检查生成的 `videos.ts` 文件

---

## 支持

如有问题，请检查：
- YouTube API 是否已启用
- API Key 是否有效
- 网络连接是否正常
