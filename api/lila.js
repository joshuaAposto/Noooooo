const axios = require("axios");

const HEADERS = {
  Accept: "application/json, text/plain, */*",
  "Content-Type": "application/json",
  Platform: "web",
  Token: "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJtYXN0ZXIiLCJhdXRoX3RpbWUiOjE3NDQ4OTAzNzgsImV4cCI6MTc0NzQ4MjM3OCwiaWF0IjoxNzQ0ODkwMzc4LCJpc3MiOiJ0aXBzeS1iYWNrZW5kIiwic3ViIjoiMTc0NDg5MDM3ODU4NzAwOTYzNCJ9.CSQme3TgPec1CzYm5RNHWA0-eTA55zhp2RQODaDJ7DmFm6phzSQveEb-j0xxLK00SnzzZhIO8tqr8l3y-kGhFYiht9hOHB3GiXeBQNQc_7fdg4dMHXo38fEC9dyv28nm92dbj9ey13Ulv9b-MwTxHpses07rW6GoH2tWkS_zsjfP4d42Hpyrn0c9vZ9xAuXqlH39YYC4OrgvchA2ErfnYp6fRwj9nqNWzXXlleuslHyeZh4Oj_eJok0Mi_2-nn1lu2n64wMpLDZYINbvkhpgabBlG-X02YcKFRR_N4zEq4CBZ1vejOfJQt_3avnW7bATTV8izKvUPIXmGC3Jyfpk7Q"
};

const meta = {
  name: "lila",
  version: "1.0.0",
  description: "Your boss has never done it before... she is scared of having relationship, but deep inside her sleeps a total pervert. She is very cold and stoic person, but if you will start talking about something weird she will completely break her character.",
  author: "Joshua Apostol",
  method: "get",
  category: "character AI",
  path: "/lila?prompt=",
};

async function onStart({ req, res }) {
  try {
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: "Add ?prompt=your_message_here" });
    }

    const data = {
      character_id: "1733817267415869802",
      content: prompt
    };

    const response = await axios.post("https://api.tipsy.chat/api/v1/chat/send_msg", data, { headers: HEADERS });

    const reply = response.data?.data?.reply?.content || "No reply found";

    res.json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
}

module.exports = { meta, onStart };