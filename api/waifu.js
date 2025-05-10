const axios = require('axios');

const meta = {
  name: "waifu",
  version: "1.0.0",
  description: "Search for waifu images",
  author: "Joshua Apostol",
  method: "get",
  category: "search",
  path: "/waifu?search=your_query"
};

async function onStart({ req, res }) {
  try {
    const searchQuery = req.query.search;

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query parameter is required" });
    }

    const url = `https://api.waifu.im/search?q=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(url);
    const data = response.data;

    res.set("Access-Control-Allow-Origin", "*");
    res.json({ data, message: "Developed by Joshua Apostol" });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while fetching the data" });
  }
}

module.exports = { meta, onStart };
