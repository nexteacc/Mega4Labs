# 视频抓取报告

这个目录存储每次运行 `npm run fetch-videos` 的报告。

## 报告文件

- `latest-fetch.json` - 最新一次抓取的详细报告

## 报告内容

```json
{
  "timestamp": "2024-10-22T10:30:00.000Z",
  "totalVideos": 45,
  "byCategory": {
    "hero": 5,
    "tutorial": 15,
    "demo": 12,
    "proReview": 8,
    "shorts": 5
  },
  "byLocale": {
    "en": 35,
    "ko": 4,
    "ja": 3,
    "zh": 3
  },
  "latestVideos": [
    {
      "id": "abc123",
      "title": "How to use Comet Browser",
      "category": "tutorial",
      "publishDate": "2024-10-20"
    }
  ]
}
```

## 查看报告

### 本地查看
```bash
cat reports/latest-fetch.json | jq
```

### GitHub Actions 查看
1. 进入仓库的 **Actions** 标签
2. 点击最新的 "Update YouTube Videos" 工作流
3. 查看 **Summary** 部分的报告
