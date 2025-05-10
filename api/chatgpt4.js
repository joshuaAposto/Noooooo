const axios = require("axios");

const meta = {
  name: "chatgpt4",
  version: "1.0.0",
  description: "Interact with Gpt4",
  author: "joshua Apostol",
  method: "get",
  category: "ai",
  path: "/chatgpt4?prompt=",
};

async function onStart({ req, res }) {
  try {
    const userPrompt = req.query.prompt;
    if (!userPrompt) {
      return res.status(400).json({ error: "Add ?prompt=hi" });
    }

    const url = "https://www.pinoygpt.com/api/chat_response.php";

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    };

    const data = new URLSearchParams({ message: userPrompt }).toString();

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      res.json({ response: response.data.response });
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get response from PinoyGPT" });
  }
}

module.exports = { meta, onStart };
