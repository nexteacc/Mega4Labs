#!/bin/bash

# SEO 配置验证脚本

echo "🔍 验证 SEO 配置..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

BASE_URL="https://perplexitypro.info"

# 1. 检查 sitemap.xml
echo "1️⃣  检查 sitemap.xml..."
SITEMAP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/sitemap.xml")
if [ "$SITEMAP_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} sitemap.xml 可访问 (HTTP $SITEMAP_STATUS)"
    
    # 检查内容
    SITEMAP_CONTENT=$(curl -s "$BASE_URL/sitemap.xml")
    URL_COUNT=$(echo "$SITEMAP_CONTENT" | grep -o "<loc>" | wc -l)
    echo -e "${GREEN}✓${NC} 包含 $URL_COUNT 个 URL"
    
    # 检查 Content-Type
    CONTENT_TYPE=$(curl -s -I "$BASE_URL/sitemap.xml" | grep -i "content-type" | cut -d' ' -f2-)
    echo -e "${GREEN}✓${NC} Content-Type: $CONTENT_TYPE"
else
    echo -e "${RED}✗${NC} sitemap.xml 无法访问 (HTTP $SITEMAP_STATUS)"
fi
echo ""

# 2. 检查 robots.txt
echo "2️⃣  检查 robots.txt..."
ROBOTS_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/robots.txt")
if [ "$ROBOTS_STATUS" = "200" ]; then
    echo -e "${GREEN}✓${NC} robots.txt 可访问 (HTTP $ROBOTS_STATUS)"
    
    # 检查是否包含 sitemap
    ROBOTS_CONTENT=$(curl -s "$BASE_URL/robots.txt")
    if echo "$ROBOTS_CONTENT" | grep -q "sitemap.xml"; then
        echo -e "${GREEN}✓${NC} robots.txt 包含 sitemap 引用"
    else
        echo -e "${RED}✗${NC} robots.txt 未包含 sitemap 引用"
    fi
else
    echo -e "${RED}✗${NC} robots.txt 无法访问 (HTTP $ROBOTS_STATUS)"
fi
echo ""

# 3. 检查主要页面
echo "3️⃣  检查主要页面..."
PAGES=("" "/ko" "/ja" "/zh")
for page in "${PAGES[@]}"; do
    PAGE_URL="$BASE_URL$page"
    PAGE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PAGE_URL")
    if [ "$PAGE_STATUS" = "200" ]; then
        echo -e "${GREEN}✓${NC} $PAGE_URL (HTTP $PAGE_STATUS)"
    else
        echo -e "${RED}✗${NC} $PAGE_URL (HTTP $PAGE_STATUS)"
    fi
done
echo ""

# 4. 检查 XML 格式
echo "4️⃣  验证 XML 格式..."
if command -v xmllint &> /dev/null; then
    if curl -s "$BASE_URL/sitemap.xml" | xmllint --noout - 2>/dev/null; then
        echo -e "${GREEN}✓${NC} sitemap.xml XML 格式正确"
    else
        echo -e "${RED}✗${NC} sitemap.xml XML 格式错误"
    fi
else
    echo -e "${YELLOW}⚠${NC}  xmllint 未安装，跳过 XML 验证"
fi
echo ""

# 5. Google 验证建议
echo "5️⃣  Google Search Console 操作建议："
echo ""
echo "   a) 删除旧的 sitemap（如果存在）"
echo "      → 进入 Google Search Console"
echo "      → 索引 > 站点地图"
echo "      → 删除现有 sitemap"
echo ""
echo "   b) 等待 5-10 分钟后重新提交"
echo "      → 输入: $BASE_URL/sitemap.xml"
echo "      → 点击提交"
echo ""
echo "   c) 请求编入索引（逐个 URL）"
echo "      → 网址检查工具"
echo "      → 输入每个 URL 并点击'请求编入索引'"
echo ""
echo "   d) 验证工具："
echo "      → https://search.google.com/test/rich-results"
echo "      → https://www.xml-sitemaps.com/validate-xml-sitemap.html"
echo ""

echo "✅ 验证完成！"
