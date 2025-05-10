const axios = require("axios");

const HEADERS = {
  "Content-Type": "application/json"
};

const meta = {
  name: "article Rewriter",
  version: "1.0.0",
  description: "Rewrites a given text or article",
  author: "Joshua Apostol",
  method: "get",
  category: "other",
  path: "/rewrite-article?text=",
};

async function onStart({ req, res }) {
  try {
    const text = req.query.text;

    if (!text) {
      return res.status(400).send("Please add ?text=your_text");
    }

    const response = await axios.post(
      "https://www.pinoygpt.com/api/article_rewriter.php",
      { text },
      { headers: HEADERS }
    );

    if (!response.data.success || !response.data.rewrittenText) {
      return res.status(400).send("Failed to rewrite article");
    }

    res.send(response.data.rewrittenText);
  } catch (error) {
    res.status(500).send("Failed to process your request");
  }
}

module.exports = { meta, onStart };
