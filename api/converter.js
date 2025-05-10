const axios = require("axios");

const HEADERS = {
  "Content-Type": "application/json"
};

const meta = {
  name: "Question to Keywords Converter",
  version: "1.0.0",
  description: "Extracts keywords from questions for better understanding",
  author: "Joshua Apostol",
  method: "get",
  category: "other",
  path: "/question/to/converter?question=",
};

async function onStart({ req, res }) {
  try {
    const question = req.query.question;
    if (!question) {
      return res.status(400).send("Please add ?question=your_question");
    }

    const data = {
      question: question
    };

    const response = await axios.post(
      "https://www.pinoygpt.com/api/question_to_keywords.php",
      data,
      { headers: HEADERS }
    );

    if (!response.data.success) {
      return res.status(400).send("Failed to extract keywords");
    }

    const keywordsString = response.data.keywords.join(", ");
    
    res.send(keywordsString);
    
  } catch (error) {
    console.error("Keyword extraction error:", error);
    res.status(500).send("Failed to process your question");
  }
}

module.exports = { meta, onStart };