# 🔧 Sitemap 问题快速修复

## 核心问题
Google 无法抓取 sitemap 的主要原因：
1. ❌ `lastModified` 每次构建都变化，但内容不变
2. ❌ `changeFrequency: "daily"` 过于频繁，不符合实际
3. ❌ Vercel 缓存导致 Google 看到旧版本

## 已修复
✅ 使用固定日期 `2025-10-30`（内容更新时手动改）  
✅ 改为 `changeFrequency: "weekly"`  
✅ 添加正确的 HTTP headers 和缓存策略  
✅ 优化 robots.txt 配置

## 立即执行（3 步）

### 1️⃣ 部署
```bash
git add .
git commit -m "修复 sitemap Google 抓取问题"
git push
```

### 2️⃣ Google Search Console
1. 删除旧 sitemap → 等 10 分钟
2. 重新提交 `sitemap.xml`
3. 网址检查 → 逐个"请求编入索引"

### 3️⃣ 验证
```bash
./scripts/verify-seo.sh
```

## 预期结果
- ⏰ 24 小时：sitemap 状态变为"成功"
- ⏰ 2-7 天：页面显示"已发现"
- ⏰ 1-2 周：完全编入索引

## 重要提醒
⚠️ 当网站内容真正更新时，记得修改 `src/app/sitemap.ts` 中的日期：
```typescript
const lastModified = "2025-10-30"; // 👈 改这里
```

## 验证链接
- Sitemap: https://perplexitypro.info/sitemap.xml
- Robots: https://perplexitypro.info/robots.txt
- Rich Results: https://search.google.com/test/rich-results
