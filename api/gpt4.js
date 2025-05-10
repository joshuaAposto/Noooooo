const fs = require("fs");
const axios = require("axios");

const meta = {
  name: "gpt4",
  version: "1.1.0",
  description: "Conversational GPT-4 to clear the conversation ?prompt=clear&uid=1",
  author: "joshua Apostol",
  method: "get",
  category: "convertional AI",
  path: "/gpt4?prompt=&uid=",
};

const url = "https://www.pinoygpt.com/api/chat_response.php";
const conversationFile = "convo.json";

if (!fs.existsSync(conversationFile)) {
  fs.writeFileSync(conversationFile, JSON.stringify({}), "utf-8");
}

function loadConversation(uid) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  return conversations[uid] || [];
}

function saveConversation(uid, messages) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  conversations[uid] = messages;
  fs.writeFileSync(conversationFile, JSON.stringify(conversations, null, 2), "utf-8");
}

function clearConversation(uid) {
  const conversations = JSON.parse(fs.readFileSync(conversationFile, "utf-8"));
  delete conversations[uid];
  fs.writeFileSync(conversationFile, JSON.stringify(conversations, null, 2), "utf-8");
}

async function onStart({ req, res }) {
  try {
    const userPrompt = req.query.prompt;
    const uid = req.query.uid;

    if (!userPrompt || !uid) {
      return res.status(400).json({ error: "Use ?prompt=hi&uid=1" });
    }

    if (userPrompt.toLowerCase() === "clear") {
      clearConversation(uid);
      return res.json({ message: "Conversation cleared." });
    }

    let conversationHistory = loadConversation(uid);
    conversationHistory.push({ role: "user", content: userPrompt });

    const response = await axios.post(
      url,
      new URLSearchParams({ message: conversationHistory.map(m => `${m.role}: ${m.content}`).join("\n") }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    if (response.status === 200) {
      const botResponse = response.data.response;
      conversationHistory.push({ role: "bot", content: botResponse });
      saveConversation(uid, conversationHistory);
      res.json({ response: botResponse });
    } else {
      res.status(response.status).json({ error: response.data });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to process request" });
  }
}

module.exports = { meta, onStart };
