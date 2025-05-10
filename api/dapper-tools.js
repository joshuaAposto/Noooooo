const axios = require('axios');
const https = require('https');

const meta = {
  name: "Dapper Tools",
  version: "1.0.0",
  description: "Chat with Dapper tools",
  author: "joshua Apostol",
  method: "get",
  category: "ai",
  path: "/dapper-tools?prompt="
};

async function onStart({ req, res }) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.json({ error: "Missing 'prompt' parameter" });
  }

  const url = 'https://zzzcode.ai/api/tools/dapper-chat';
  const headers = { 'Content-Type': 'application/json' };

  const payload = {
    p1: '96587e98-ee7d-4ac9-b906-f05b3e168a46',
    p2: '',
    p3: prompt,
    p4: '',
    p5: '',
    option1: '',
    option2: '',
    option3: ''
  };

  const agent = new https.Agent({ keepAlive: true });

  try {
    const response = await axios.post(url, payload, {
      headers,
      responseType: 'stream',
      httpsAgent: agent
    });

    let chunks = [];

    return new Promise((resolve, reject) => {
      response.data.on('data', chunk => {
        const lines = chunk.toString().split('\n');
        lines.forEach(line => {
          if (line.startsWith('data: ')) {
            const content = line.replace('data: ', '').trim();
            if (!content || content.includes('zzzmessageidzzz') || content.includes('zzz_completed_zzz')) return;
            try {
              const parsed = JSON.parse(content);
              if (typeof parsed === 'string') chunks.push(parsed);
            } catch {}
          }
        });
      });

      response.data.on('end', () => {
        const final = chunks.join(' ').replace(/ \n/g, '\n').replace(/\n /g, '\n').trim();
        return res.json({
          response: final,
          prompt
        });
        resolve();
      });

      response.data.on('error', (err) => {
        res.status(500).json({ error: "Stream error", details: err.message });
        reject(err);
      });
    });
  } catch (err) {
    return res.status(500).json({ error: "Request failed", details: err.message });
  }
}

module.exports = { meta, onStart };
