const axios = require("axios");
const FormData = require("form-data");

const meta = {
  name: "zombie",
  version: "1.0.0",
  description: "Convert image to zombie style",
  author: "joshua Apostol",
  method: "get",
  category: "images",
  path: "/zombie?imageUrl=",
};

async function onStart({ req, res }) {
  try {
    const imageUrl = req.query.imageUrl;
    if (!imageUrl) {
      return res.status(400).json({ error: "Add ?imageUrl=https://..." });
    }

    const img = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const imageBuffer = Buffer.from(img.data);

    const formData = new FormData();
    formData.append("image", imageBuffer, {
      filename: "image.jpeg",
      contentType: "image/jpeg",
    });

    const headers = formData.getHeaders();

    const { data } = await axios.post(
      "https://deepgrave-image-processor-no7pxf7mmq-uc.a.run.app/transform_in_place",
      formData,
      {
        headers: {
          ...headers,
        },
      }
    );

    const resultBuffer = Buffer.from(data, "base64");

    res.setHeader("Content-Type", "image/png");
    res.send(resultBuffer);
  } catch (err) {
    res.status(500).json({ error: "Failed to process zombie image" });
  }
}

module.exports = { meta, onStart };
