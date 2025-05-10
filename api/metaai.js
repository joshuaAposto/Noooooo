const axios = require("axios");
const tough = require("tough-cookie");
const { CookieJar } = require("tough-cookie");

const meta = {
  name: "metaai",
  version: "1.0.0",
  description: "Interact with Meta AI",
  author: "Joshua Apostol",
  method: "get",
  category: "ai",
  path: "/metaai?prompt=",
};

const session = axios.create({
  jar: new CookieJar(),
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    Referer: "https://www.blackbox.ai/",
    Origin: "https://www.blackbox.ai",
  },
});

async function autoGetToken() {
  try {
    const response = await session.get("https://www.blackbox.ai");
    if (response.status === 200) {
      return response.headers["set-cookie"] || [];
    }
  } catch (error) {
    console.error("Error fetching token:", error.message);
  }
  return [];
}

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Add ?prompt=your_message_here" });
    }

    const cookies = await autoGetToken();
    const data = {
      messages: [{ role: "user", content: prompt }],
      agentMode: { mode: true, id: "meta-llama/Llama-3.3-70B-Instruct-Turbo" },
      id: "HKFs3BR",
      codeModelMode: true,
      isChromeExt: false,
      mobileClient: false,
      validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
    };

    const response = await session.post("https://www.blackbox.ai/api/chat", data, { headers: { Cookie: cookies.join("; ") } });

    if (response.status === 200) {
      res.json(response.data);
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
}

module.exports = { meta, onStart };
