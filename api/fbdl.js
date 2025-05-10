const meta = {
  name: "fbdl",
  version: "1.0.0",
  description: "Download Facebook videos",
  author: "joshua Apostol",
  method: "get",
  category: "downloader",
  path: "/fbdl?url="
};

const dl = require("@xaviabot/fb-downloader");

async function onStart({ res, req }) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ status: false, error: "Missing URL!" });
  }

  try {
    const result = await dl(url);
    res.json({ result: result.sd });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };
