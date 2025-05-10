const axios = require("axios");

const meta = {
  name: "tikdl",
  version: "1.0.0",
  description: "Download TikTok videos without watermark",
  author: "joshua Apostol",
  method: "get",
  category: "downloader",
  path: "/tikdl?url=",
};

async function onStart({ req, res }) {
  try {
    const videoUrl = req.query.url;
    if (!videoUrl) {
      return res.status(400).json({ error: "Add ?url=your_tiktok_video_url" });
    }

    const url = "https://www.pinoygpt.com/api/tiktok_downloader.php";

    const headers = {
      "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      Accept: "application/json, text/javascript, */*; q=0.01",
      "X-Requested-With": "XMLHttpRequest",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
    };

    const data = new URLSearchParams({ url: videoUrl });

    const response = await axios.post(url, data, { headers });

    if (response.status === 200) {
      const resJson = response.data;

      if (resJson.success && resJson.data && resJson.data.data) {
        const videoData = resJson.data.data;

        return res.json({
          download_link: videoData.video_link_nwm || "",
          description: videoData.desc || "",
        });
      } else {
        return res.json({ error: "Invalid response or missing data" });
      }
    }

    res.status(response.status).json({ error: `Request failed (Status: ${response.status})` });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch TikTok video" });
  }
}

module.exports = { meta, onStart };
