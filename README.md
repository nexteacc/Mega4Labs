# Mega 4 Labs

AI industry leader interview video aggregation platform, featuring interviews, talks, and insights from leaders at OpenAI, Cursor, Google, and Anthropic.

## Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Environment Variables

Create a `.env.local` file:

```bash
# Exa AI API Key (for intelligent video search and summaries)
EXA_API_KEY=your_exa_api_key_here

# YouTube API Key (for video metadata: duration only)
YOUTUBE_API_KEY=your_youtube_api_key_here
```

### 3. Run Development Server

```bash
pnpm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Automated Video Updates

Videos are automatically fetched and updated daily at **UTC 02:00** (Beijing time 10:00) via GitHub Actions.

To manually fetch videos:

```bash
pnpm run fetch-videos
```

This will:
1. Search for videos using Exa AI
2. Fetch metadata from YouTube API
3. Generate `src/data/videos.ts` and `reports/latest-fetch.json`

### GitHub Actions Setup

For automated video updates, configure these secrets in your GitHub repository:

1. Go to **Settings → Secrets and variables → Actions**
2. Add the following secrets:
   - `EXA_API_KEY` - Your Exa AI API key
   - `YOUTUBE_API_KEY` - Your YouTube API key

The workflow runs automatically daily or can be triggered manually via **Actions → Update Videos → Run workflow**.
