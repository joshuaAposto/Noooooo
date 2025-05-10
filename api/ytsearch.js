const meta = {
  name: "ytsearch",
  version: "1.0.0",
  description: "Search YouTube videos via API",
  author: "joshua Apostol",
  method: "get",
  category: "search",
  path: "/ytsearch?query="
};

const axios = require('axios');

async function onStart({ res, req }) {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({
      status: false,
      error: 'Query parameter is required'
    });
  }

  const url = `https://me0xn4hy3i.execute-api.us-east-1.amazonaws.com/staging/api/resolve/resolveYoutubeSearch?search=${encodeURIComponent(query)}`;

  const headers = {
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132"',
    "sec-ch-ua-mobile": "?1",
    "sec-ch-ua-platform": '"Android"',
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "cross-site",
    Referer: "https://v4.mp3paw.link/",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  };

  try {
    const response = await axios.get(url, { headers });
    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };
