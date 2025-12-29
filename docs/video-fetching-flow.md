┌─────────────────────────────────────────────────────────────┐
│ Phase 0: Setup                                              │
├─────────────────────────────────────────────────────────────┤
│ File: .env.local                                            │
│ Purpose: Configure YOUTUBE_API_KEY                          │
│                                                             │
│ File: config/youtube-search.ts                              │
│ Purpose: Define search strategy                             │
│   - AI_LEADERS: Company config (name, color, people)        │
│   - SEARCH_QUERIES: Keywords + company + person             │
│   - QUALITY_FILTERS: Quality filtering rules                │
│   - YOUTUBE_API_CONFIG: API configuration                   │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Fetch Videos                                       │
├─────────────────────────────────────────────────────────────┤
│ Command: npm run fetch-videos                               │
│ File: scripts/fetch-youtube-videos.ts                       │
│                                                             │
│ Subprocess 1.1: Initialize                                  │
│   - Load environment variables                              │
│   - Validate API Key                                        │
│   - Prepare data containers                                 │
│                                                             │
│ Subprocess 1.2: Search Loop (for each SEARCH_QUERY)         │
│   ├─ Call Search API                                        │
│   ├─ Call Videos API (batch fetch details)                  │
│   ├─ Quality filter (passesQualityFilter)                   │
│   ├─ Data transform (convertToLandingVideo)                 │
│   ├─ Dedupe (by videoId)                                    │
│   └─ Delay 1 second (avoid quota)                           │
│                                                             │
│ Subprocess 1.3: Post-processing                             │
│   ├─ Global dedupe                                          │
│   ├─ Sort by publish date                                   │
│   └─ Generate statistics report                             │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Generate Files                                     │
├─────────────────────────────────────────────────────────────┤
│ Output 1: src/data/videos.ts                                │
│   - TypeScript format                                       │
│   - Contains all video data                                 │
│   - Auto-imports Zod Schema validation                      │
│                                                             │
│ Output 2: reports/latest-fetch.json                         │
│   - JSON format report                                      │
│   - Statistics (total, by company)                          │
│   - Latest videos list                                      │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 3: Data Validation                                    │
├─────────────────────────────────────────────────────────────┤
│ File: src/lib/videos.ts                                     │
│ Purpose: Define Zod Schema                                  │
│                                                             │
│ Validation points:                                          │
│   ✓ id is not empty                                         │
│   ✓ company is valid (openai/cursor/deepmind/anthropic)     │
│   ✓ category is valid (hero + companies)                    │
│   ✓ title/description not empty                             │
│   ✓ thumbnail URL format correct                            │
│                                                             │
│ File: src/data/videos.ts                                    │
│ Execute: export const videos = Schema.parse(rawVideos)      │
│ Result: If data invalid, build error                        │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 4: Content Aggregation                                │
├─────────────────────────────────────────────────────────────┤
│ File: src/lib/content.ts                                    │
│                                                             │
│ Function 1: getHeroVideos()                                 │
│   - Get videos with category="hero"                         │
│   - Return max 4 videos                                     │
│                                                             │
│ Function 2: getVideoModules()                               │
│   - Organize videos by company                              │
│   - Return OpenAI/Cursor/DeepMind/Anthropic modules         │
│   - Each module: displayName, description, color, videos    │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 5: Page Rendering                                     │
├─────────────────────────────────────────────────────────────┤
│ File: src/app/page.tsx                                      │
│                                                             │
│ Render flow:                                                │
│   1. Call getHeroVideos()                                   │
│   2. Call getVideoModules()                                 │
│   3. Render components:                                     │
│      - HeroSection (featured videos)                        │
│      - CompanySection × 4 (company modules)                 │
│      - FAQSection (FAQ)                                     │
│   4. Inject JSON-LD structured data                         │
└─────────────────────────────────────────────────────────────┘
