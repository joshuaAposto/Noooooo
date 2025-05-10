const axios = require("axios");

const meta = {
  name: "aiDetector",
  version: "1.0.0",
  description: "Detects if a given text is AI-generated",
  author: "joshua Apostol",
  method: "get",
  category: "other",
  path: "/ai-detector?text=",
};

async function onStart({ req, res }) {
  try {
    const userText = req.query.text;
    if (!userText) {
      return res.status(400).json({ error: "Add ?text=your_text_here" });
    }

    const url = "https://www.pinoygpt.com/api/generate_ai_detector.php";

    const headers = {
      "Content-Type": "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    };

    const data = { text: userText };

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      res.json({ result: response.data.result });
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to check AI-generated text" });
  }
}

module.exports = { meta, onStart };
