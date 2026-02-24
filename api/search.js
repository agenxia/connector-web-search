export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, limit = 10, safe_search = true } = req.body;
  if (!query) {
    return res.status(400).json({ success: false, error: 'query is required' });
  }

  try {
    // DuckDuckGo instant answer API (no key required)
    const url = `https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&no_html=1&skip_disambig=1`;
    const response = await fetch(url);
    const data = await response.json();

    const results = [];
    if (data.Abstract) {
      results.push({ title: data.Heading, snippet: data.Abstract, url: data.AbstractURL, source: data.AbstractSource });
    }
    if (data.RelatedTopics) {
      for (const topic of data.RelatedTopics.slice(0, limit - results.length)) {
        if (topic.Text) {
          results.push({ title: topic.Text.split(' - ')[0], snippet: topic.Text, url: topic.FirstURL, source: 'DuckDuckGo' });
        }
      }
    }

    res.status(200).json({
      success: true,
      data: { query, results, total: results.length, provider: 'duckduckgo', timestamp: new Date().toISOString() },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Search failed: ' + error.message });
  }
}
