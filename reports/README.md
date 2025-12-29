# Video Fetch Reports

This directory stores reports from each `pnpm run fetch-videos` execution.

## Report Files

- `latest-fetch.json` - Latest fetch report with statistics

## Report Content

```json
{
  "timestamp": "2025-12-29T13:18:35.789Z",
  "source": "Exa AI + YouTube API",
  "totalVideos": 98,
  "byCompany": {
    "openai": 20,
    "cursor": 21,
    "google": 27,
    "anthropic": 30
  },
  "byPerson": {
    "Sam Altman": 15,
    "Kevin Weil": 5,
    ...
  },
  "strategy": {
    "searchEngine": "Exa AI auto search",
    "metadataSource": "YouTube API (duration only)",
    "filtering": "Date range (2 years) + domain (youtube.com)",
    "organization": "By person (interview subjects)"
  },
  "latestVideos": [
    {
      "id": "abc123",
      "title": "Sam Altman on AI Future",
      "company": "openai",
      "person": "Sam Altman",
      "publishDate": "2025-12-28"
    }
  ]
}
```

## View Reports

### Local
```bash
cat reports/latest-fetch.json | jq
```

### GitHub Actions
1. Go to **Actions** tab
2. Click latest "Update Videos" workflow
3. View **Summary** section for report details

## Purpose

- Monitor daily automated fetch health
- Track video count trends by company/person
- Debug issues with Exa AI or YouTube API
- Verify fetch strategy is working correctly
