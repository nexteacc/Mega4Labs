┌─────────────────────────────────────────────────────────────┐
│ Phase 0: Setup                                              │
├─────────────────────────────────────────────────────────────┤
│ File: .env.local                                            │
│ Purpose: Configure API Keys                                 │
│   - EXA_API_KEY: Exa AI search engine                        │
│   - YOUTUBE_API_KEY: YouTube video metadata                 │
│                                                             │
│ File: config/video-search.ts                                │
│ Purpose: Define search strategy                             │
│   - AI_LEADERS: Company config (name, displayName, people)  │
│   - SEARCH_QUERIES: 13 search tasks (4 companies × people)  │
│   - EXA_CONFIG: Exa AI configuration                        │
│   - CONFIG: Simple config (heroCount: 4)                    │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 1: Fetch Videos                                       │
├─────────────────────────────────────────────────────────────┤
│ Command: pnpm run fetch-videos                              │
│ File: scripts/fetch-videos.ts                               │
│                                                             │
│ Subprocess 1.1: Initialize                                  │
│   - Load environment variables (.env.local)                 │
│   - Validate EXA_API_KEY and YOUTUBE_API_KEY                │
│   - Initialize Exa client                                   │
│                                                             │
│ Subprocess 1.2: Search Loop (for each SEARCH_QUERY)         │
│   ├─ Call Exa AI searchAndContents()                        │
│   │  └─ Returns: title, url, publishedDate, author, summary │
│   ├─ Extract YouTube video ID from URL                      │
│   ├─ Batch fetch YouTube metadata (duration only)           │
│   ├─ Deduplicate by video ID                                │
│   ├─ Data transform (ExaResult → LandingVideo)              │
│   └─ Delay 1 second (rate limiting)                         │
│                                                             │
│ Subprocess 1.3: Post-processing                             │
│   ├─ Sort each company's videos by publish date (newest)    │
│   ├─ Select Hero videos (top 4 most recent)                 │
│   ├─ Merge all videos                                       │
│   ├─ Final sort by publish date (newest first)              │
│   └─ Generate statistics report                             │
└─────────────────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────────────────┐
│ Phase 2: Generate Files                                     │
├─────────────────────────────────────────────────────────────┤
│ Output 1: src/data/videos.ts                                │
│   - TypeScript format                                       │
│   - Contains 98 video objects                               │
│   - Auto-imports Zod Schema validation                      │
│   - Exports: export const videos = Schema.parse(rawVideos)  │
│                                                             │
│ Output 2: reports/latest-fetch.json                         │
│   - JSON format report                                      │
│   - Statistics (total, by company, by person)               │
│   - Latest 5 videos list                                    │
│   - Strategy metadata                                       │
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
│   ✓ company is valid (openai/cursor/google/anthropic)     │
│   ✓ category is valid (hero + companies)                    │
│   ✓ title/description not empty                             │
│   ✓ thumbnail URL format correct                            │
│   ✓ duration is ISO 8601 format                             │
│                                                             │
│ File: src/data/videos.ts                                    │
│ Execute: export const videos = Schema.parse(rawVideos)      │
│ Result: If data invalid, build error (prevents deployment)  │
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
│   - Return OpenAI/Cursor/Google/Anthropic modules         │
│   - Each module: company, displayName, description, color   │
│                                                             │
│ Function 3: getVideosByCompany(company)                     │
│   - Get all videos for a specific company                   │
│   - Sorted by publish date (newest first)                   │
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
│      - HeroSection (featured 4 videos)                      │
│      - CompanySection × 4 (company modules)                 │
│      - FAQSection (FAQ)                                     │
│   4. Inject JSON-LD structured data for SEO                 │
│                                                             │
│ File: src/components/VideoCard.tsx                          │
│   - Display: thumbnail, title, description, duration, date  │
│   - Click: open VideoPlayerDialog                           │
│                                                             │
│ File: src/components/VideoPlayerDialog.tsx                  │
│   - Display: YouTube iframe, title, channel, AI summary     │
│   - Scrollable: AI summary section (max-height: 200px)      │
└─────────────────────────────────────────────────────────────┘
