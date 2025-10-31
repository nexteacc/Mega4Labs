# Vercel Analytics 使用指南

## 概述

项目已集成 **Vercel Analytics**，自动跟踪所有 CTA 点击、视频播放和语言切换事件。

## 当前状态

✅ **已集成** - `@vercel/analytics` v1.4.1  
✅ **已配置** - 在 `src/app/layout.tsx` 中  
✅ **已连接** - 所有 CTA 按钮、视频卡片、语言切换器都已连接

## 跟踪的事件

### 1. CTA 点击 (`cta_click`)

**触发位置：**
- Hero Section（首屏大按钮）
- Video Module（视频模块中的按钮，3个）
- Intermediate CTA（中间 CTA 区域）
- Footer CTA（底部 CTA 区域）
- Announcement Banner（顶部横幅）

**数据字段：**
```typescript
{
  location: "hero" | "module" | "intermediate" | "footer" | "top_banner",
  locale: "en" | "ko" | "ja" | "zh",
  href: string  // 目标链接
}
```

**示例：**
```javascript
// 用户点击 Hero 区域的 CTA 按钮
{
  event: "cta_click",
  location: "hero",
  locale: "en",
  href: "https://perplexity.ai/..."
}
```

### 2. 视频播放 (`video_play`)

**触发时机：** 用户点击视频卡片

**数据字段：**
```typescript
{
  videoId: string,
  title: string,
  category: "hero" | "tutorial" | "proReview" | "shorts",
  locale: string,
  platform: "youtube"
}
```

**示例：**
```javascript
{
  event: "video_play",
  videoId: "abc123xyz",
  title: "Comet Browser Tutorial",
  category: "tutorial",
  locale: "en",
  platform: "youtube"
}
```

### 3. 语言切换 (`language_switch`)

**触发时机：** 用户切换网站语言

**数据字段：**
```typescript
{
  from: string,  // 原语言
  to: string     // 目标语言
}
```

**示例：**
```javascript
{
  event: "language_switch",
  from: "en",
  to: "ko"
}
```

---

## 如何查看数据

### 方法 1：Vercel Dashboard（推荐）

1. 登录 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 点击左侧菜单的 **Analytics**
4. 查看 **Events** 标签页
5. 你会看到所有自定义事件：
   - `cta_click`
   - `video_play`
   - `language_switch`

### 方法 2：开发环境测试

在本地开发时，打开浏览器控制台：

```bash
npm run dev
```

然后点击任何 CTA 按钮或视频，控制台会显示：

```
[analytics] cta_click { location: 'hero', locale: 'en', href: '...' }
```

---

## 关键指标分析

### CTA 转化率

**问题：** 哪个位置的 CTA 按钮点击率最高？

**查看方式：**
1. 在 Vercel Analytics 中筛选 `cta_click` 事件
2. 按 `location` 字段分组
3. 对比不同位置的点击量

**预期结果：**
- Hero CTA 通常点击率最高（首屏可见）
- Footer CTA 次之（用户浏览完内容后）
- Module CTA 最低（需要滚动到特定位置）

### 视频参与度

**问题：** 哪个类别的视频最受欢迎？

**查看方式：**
1. 筛选 `video_play` 事件
2. 按 `category` 字段分组
3. 对比播放量

**预期结果：**
- Tutorial 视频通常播放量最高（实用性强）
- Shorts 次之（快速消费）
- ProReview 最低（需要更多时间投入）

### 多语言用户分布

**问题：** 哪个语言市场的用户最活跃？

**查看方式：**
1. 查看所有事件的 `locale` 字段分布
2. 对比不同语言的事件总量

**预期结果：**
- 英文用户通常占比最高（全球市场）
- 其他语言根据目标市场而定

---

## 高级用法

### 自定义事件监听

如果需要在应用内响应分析事件：

```typescript
// 在任何组件中
useEffect(() => {
  const handleCTAClick = (event: CustomEvent) => {
    console.log('CTA clicked:', event.detail);
    // 执行自定义逻辑，例如显示感谢消息
  };

  window.addEventListener('analytics:cta_click', handleCTAClick as EventListener);

  return () => {
    window.removeEventListener('analytics:cta_click', handleCTAClick as EventListener);
  };
}, []);
```

### 添加新事件

1. 在 `src/hooks/useAnalytics.ts` 中添加事件类型：

```typescript
type AnalyticsEvent = 
  | "video_play" 
  | "cta_click" 
  | "language_switch"
  | "your_new_event";  // 添加新事件
```

2. 在需要的地方调用：

```typescript
const { track } = useAnalytics();

track("your_new_event", {
  custom_field: "value",
  another_field: 123
});
```

---

## 数据隐私

- ✅ 不收集任何个人身份信息（PII）
- ✅ 只跟踪用户行为（点击、播放、切换）
- ✅ 符合 GDPR 和 CCPA 要求
- ✅ Vercel Analytics 是隐私友好的（不使用 cookies）

---

## 常见问题

### Q: 为什么开发环境看不到 Vercel Dashboard 的数据？

A: Vercel Analytics 只在生产环境（部署后）收集数据。本地开发时只会在控制台输出日志。

### Q: 如何测试事件是否正常工作？

A: 
1. 本地开发：查看浏览器控制台日志
2. 生产环境：部署后等待几分钟，然后查看 Vercel Dashboard

### Q: 数据多久更新一次？

A: Vercel Analytics 通常有 5-10 分钟的延迟。实时数据可能需要等待一段时间才能显示。

### Q: 可以导出数据吗？

A: 是的，Vercel Analytics 支持数据导出。在 Dashboard 中点击 "Export" 按钮。

### Q: 如果想切换到 Google Analytics 怎么办？

A: 可以同时使用多个分析工具。参考 `docs/analytics-tracking.md` 了解如何集成其他工具。

---

## 成本

Vercel Analytics 的定价：
- **Hobby 计划**：免费，每月 2,500 个事件
- **Pro 计划**：$20/月，每月 100,000 个事件
- **Enterprise**：自定义定价

对于大多数项目，免费计划已经足够。

---

## 总结

✅ **已完成集成** - 无需额外配置  
✅ **自动跟踪** - 所有关键用户行为都已连接  
✅ **隐私友好** - 不使用 cookies，符合隐私法规  
✅ **易于查看** - 直接在 Vercel Dashboard 查看数据

只需部署到 Vercel，数据就会自动开始收集！
