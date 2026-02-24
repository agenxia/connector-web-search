# Web Search Connector

Search the web via multiple providers and return structured results.

## Endpoints

- `POST /api/search` — Search the web
- `GET /api/status` — Connector health

## Request

```json
{ "query": "your search terms", "limit": 10, "safe_search": true }
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| SEARCH_API_KEY | API key for search provider (optional for DuckDuckGo) |
| SEARCH_PROVIDER | Search provider: duckduckgo (default), google, bing |
