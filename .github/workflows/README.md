# GitHub Actions 工作流

## 📋 配置说明

### Update YouTube Videos

自动抓取 YouTube 视频并更新数据文件。

**配置版本：** 2025 年最新标准

#### 使用的 Actions 版本

| Action | 版本 | 发布日期 | 说明 |
|--------|------|---------|------|
| `actions/checkout` | v5 | 2024 | 最新稳定版 |
| `actions/setup-node` | v6 | 2024 | 支持 Node.js 22 |
| `actions/upload-artifact` | v4 | 2024 | 新版 artifact API |

#### 运行时环境

- **操作系统**: `ubuntu-latest` (Ubuntu 22.04+)
- **Node.js**: 22.x LTS
- **包管理器**: npm (使用 `npm ci` 确保可重现构建)

#### 触发条件

1. **定时触发**: 每天 UTC 02:00（北京时间 10:00）
2. **手动触发**: 在 Actions 页面点击 "Run workflow"

#### 权限配置

```yaml
permissions:
  contents: write  # 允许推送提交
```

这是 2025 年推荐的最小权限原则配置。

#### 工作流程

1. ✅ 检出代码
2. ✅ 设置 Node.js 22 + npm 缓存
3. ✅ 安装依赖 (`npm ci`)
4. ✅ 运行抓取脚本
5. ✅ 检查是否有变化
6. ✅ 如有变化，提交并推送
7. ✅ 生成摘要报告
8. ✅ 上传详细报告（保留 30 天）

#### 查看报告

**方式 1: Summary 页面**
```
Actions → Update YouTube Videos → 最新运行 → Summary
```

**方式 2: 下载 Artifact**
```
Actions → Update YouTube Videos → 最新运行 → Artifacts → fetch-report-xxx
```

#### 环境变量

需要在仓库 Settings → Secrets 中配置：

- `YOUTUBE_API_KEY`: YouTube Data API v3 密钥

#### 最佳实践

✅ 使用 `npm ci` 而非 `npm install`（更快、更可靠）
✅ 使用 `[skip ci]` 避免无限循环
✅ 使用 `if: always()` 确保报告总是生成
✅ 使用 `permissions` 明确声明所需权限
✅ 使用 `actions/upload-artifact@v4` 保存报告
✅ 使用官方 GitHub Actions bot 邮箱

#### 故障排查

**问题 1: 权限错误**
```
Error: refusing to allow a GitHub App to create or update workflow
```
解决：确保 `permissions: contents: write` 已配置

**问题 2: API Key 未设置**
```
❌ 错误：未设置 YOUTUBE_API_KEY 环境变量
```
解决：在 Settings → Secrets 中添加 `YOUTUBE_API_KEY`

**问题 3: 推送失败**
```
! [remote rejected] main -> main (protected branch hook declined)
```
解决：在 Settings → Branches 中允许 GitHub Actions 推送到保护分支

#### 监控与维护

- 每次运行会生成 Summary 报告
- Artifact 保留 30 天
- 失败时会收到邮件通知（如果启用）
- 可在 Actions 页面查看历史运行记录

#### 成本

- ✅ 公开仓库：完全免费
- ✅ 私有仓库：每月 2000 分钟免费额度
- ✅ 预计每次运行：2-3 分钟

#### 更新日志

- **2025-10-22**: 初始版本，使用最新 Actions v5/v6
