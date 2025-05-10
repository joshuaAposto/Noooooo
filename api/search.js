const DDG = require("duck-duck-scrape");

const meta = {
  name: "search",
  version: "1.0.0",
  description: "Search for a topic on DuckDuckGo",
  author: "Joshua Apostol",
  method: "get",
  category: "search",
  path: "/search?query="
};

async function onStart({ req, res }) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ status: false, error: "Please add ?query=your_search_query" });
  }

  try {
    const searchResults = await DDG.search(query, { safeSearch: DDG.SafeSearchType.STRICT });

    if (!searchResults?.results?.length) {
      return res.status(404).json({ status: false, error: "No search results found" });
    }

    const results = searchResults.results.slice(0, 5).map(result => ({
      title: result.title,
      description: result.description.replace(/<\/?b>/g, ""),
      source: result.hostname,
      url: result.url
    }));

    res.json({ status: true, results });
  } catch {
    res.status(500).json({ status: false, error: "Failed to perform search" });
  }
}

module.exports = { meta, onStart };
