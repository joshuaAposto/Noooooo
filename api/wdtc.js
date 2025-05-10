const axios = require("axios");

const meta = {
  name: "wdtc",
  version: "1.0.0",
  description: "Explain code using WhatDoesThisCodeDo",
  author: "joshua Apostol",
  method: "post",
  category: "ai",
  path: "/wdtc?code=",
};

async function onStart({ req, res }) {
  try {
    const code = req.body?.code;

    if (!code?.trim()) {
      return res.status(400).json({ error: "Body must include `code`." });
    }

    if (code.length > 5000) {
      return res
        .status(400)
        .json({ error: "Code exceeds maximum length of 5000 characters." });
    }

    const { data } = await axios.post(
      "https://whatdoesthiscodedo.com/api/stream-text",
      { code },
      {
        headers: {
          Accept: "*/*",
          "Content-Type": "application/json",
          Origin: "https://whatdoesthiscodedo.com",
          Referer: "https://whatdoesthiscodedo.com/",
          "User-Agent": "Postify/1.0.0",
        },
        responseType: "text",
      }
    );

    const cleaned = data
      .split("\n")
      .filter((line) => !line.includes("Share this explanation"))
      .join("\n")
      .trim();

    res.json({ explanation: cleaned });
  } catch (error) {
    res.status(500).json({
      error: error.response?.data || error.message || "Error processing code.",
    });
  }
}

module.exports = { meta, onStart };
