const axios = require("axios");

const meta = {
  name: "webpilot",
  version: "1.0.0",
  description: "Ask questions using WebPilot AI",
  author: "joshua Apostol",
  method: "get",
  category: "ai",
  path: "/webpilot?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Add ?prompt=your question" });
    }

    const url = "https://api.webpilotai.com/rupee/v1/search";
    const headers = {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json;charset=UTF-8",
      Authorization: "Bearer null",
      "User-Agent":
        "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36",
      Referer:
        "https://www.webpilot.ai/search?lang=en-US&threadId=1bc910c4-4e48-4461-8dbc-937c67996dce",
    };

    const body = {
      q: prompt,
      threadId: "",
    };

    const response = await axios.post(url, body, { headers });
    const lines = response.data.split("\n");

    const result = lines
      .filter((line) => line.startsWith("data:"))
      .map((line) => {
        try {
          const parsed = JSON.parse(line.slice(5));
          return parsed?.data?.content || "";
        } catch {
          return "";
        }
      })
      .join("");

    res.json({ response: result.trim() });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch from WebPilot" });
  }
}

module.exports = { meta, onStart };
