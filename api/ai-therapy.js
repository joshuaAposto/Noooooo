const axios = require("axios");

const HEADERS = {
  "Content-Type": "application/json"
};

const meta = {
  name: "ai-therapy",
  version: "1.0.0",
  description: "AI-powered emotional support responder",
  author: "Joshua Apostol",
  method: "post",
  category: "other",
  path: "/ai-therapy?message=",
};

async function onStart({ req, res }) {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).send("Please provide 'message' in the body.");
    }

    const response = await axios.post(
      "https://www.pinoygpt.com/api/ai_therapy.php",
      { message },
      { headers: HEADERS }
    );

    if (!response.data.success || !response.data.response) {
      return res.status(400).send("Failed to get therapy response");
    }

    res.send(response.data.response);
  } catch (error) {
    res.status(500).send("Failed to process your request");
  }
}

module.exports = { meta, onStart };
