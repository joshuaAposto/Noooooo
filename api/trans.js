const axios = require('axios');

const meta = {
  name: "google translator",
  version: "1.0.0",
  description: "Google Translator UGH",
  author: "joshua Apostol",
  method: "get",
  category: "other",
  path: "/translate?sl=en&tl=en&q="
};

async function onStart({ req, res }) {
  const { sl = 'en', tl = 'en', q } = req.query;
  if (!q) {
    return res.status(400).json({ status: false, error: "Query parameter `q` is required" });
  }

  const url = 'https://translate.google.so/translate_a/t';
  try {
    const response = await axios.get(url, {
      params: { client: 'hahahahha', sl, tl, q },
      headers: { 'User-Agent': 'Mozilla/5.0' },
      timeout: 10000
    });
    
    const data = response.data;
    if (!Array.isArray(data)) {
      return res.status(502).json({ status: false, error: "Unexpected response format" });
    }
    
    res.json({ status: true, translation: data });

  } catch (err) {
    res.status(500).json({ status: false, error: err.message });
  }
}

module.exports = { meta, onStart };
