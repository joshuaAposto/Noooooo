const { GoogleGenAI } = require("@google/genai");

const meta = {
  name: "gemini",
  version: "1.0.0",
  description: "Interact with Gemini",
  author: "joshua Apostol",
  method: "get",
  category: "ai",
  path: "/gemink?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Add ?prompt=your question here" });
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY || "AIzaSyAT8Zquyjd_acPfoGngwgD6dY4rlcK6H40",
    });

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    res.json({ response: response.text });
  } catch (err) {
    console.error("Error generating AI content:", err);
    res.status(500).json({ error: "Failed to generate AI content" });
  }
}

module.exports = { meta, onStart };
