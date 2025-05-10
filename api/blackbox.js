const meta = {
  name: "blackbox",
  version: "1.0.0",
  description: "Blackbox AI chat API integration",
  author: "joshua Apostol",
  method: "get",
  category: "ai",
  path: "/blackbox?prompt="
};

const axios = require("axios");

async function onStart({ res, req }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      status: false,
      error: "Prompt parameter is required"
    });
  }

  const url = "https://www.blackbox.ai/api/chat";
  const headers = {
    "Content-Type": "application/json",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    "Referer": "https://www.blackbox.ai/",
    "Origin": "https://www.blackbox.ai"
  };

  const body = {
    messages: [{ role: "user", content: prompt, id: "oyz7A7V" }],
    agentMode: {},
    id: "nMNHRcm",
    previewToken: null,
    userId: null,
    codeModelMode: true,
    trendingAgentMode: {},
    isMicMode: false,
    userSystemPrompt: null,
    maxTokens: 1024,
    playgroundTopP: null,
    playgroundTemperature: null,
    isChromeExt: false,
    githubToken: "",
    clickedAnswer2: false,
    clickedAnswer3: false,
    clickedForceWebSearch: false,
    visitFromDelta: false,
    isMemoryEnabled: false,
    mobileClient: false,
    userSelectedModel: null,
    validated: "00f37b34-a166-4efb-bce5-1312d87f2f94",
    imageGenerationMode: false,
    webSearchModePrompt: false,
    deepSearchMode: false,
    domains: null,
    vscodeClient: false,
    codeInterpreterMode: false,
    customProfile: {
      name: "",
      occupation: "",
      traits: [],
      additionalInfo: "",
      enableNewChats: false
    },
    session: {
      user: {
        name: "joshua Apostol",
        email: "joshuaapostol220@gmail.com",
        image: "https://lh3.googleusercontent.com/a/ACg8ocJjzWtKH0MZ2MihWSgkZi3bG_e4VsQfcjOsaWnbNgYaPY3C9vk=s96-c"
      },
      expires: "2025-04-07T12:28:21.544Z"
    },
    isPremium: false,
    subscriptionCache: {
      status: "FREE",
      expiryTimestamp: null,
      lastChecked: 1741436842401,
      isTrialSubscription: false
    },
    beastMode: false
  };

  try {
    const response = await axios.post(url, body, { headers });
    res.json({ query: prompt, response: response.data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };
