const axios = require("axios");
const qs = require('qs');
const UserAgent = require('user-agents');

const meta = {
  name: "freesms",
  version: "1.0.0",
  description: "Send free SMS",
  author: "joshua Apostol",
  method: "get",
  category: "utility",
  path: "/sms?number=&message=",
};

function randomId() {
  return Array.from({ length: 16 }, () => 'abcdef0123456789'[Math.floor(Math.random() * 16)]).join('');
}

function randomToken() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  return 'cLjBqxTHR8edNkAP7GG4R-:APA91b' + Array.from({ length: 152 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

function randomModel() {
  const models = ['TECNO LH8n', 'Samsung Galaxy S21', 'iPhone 13 Pro', 'Google Pixel 6', 'Xiaomi Redmi Note 10', 'OnePlus 9', 'Huawei P40', 'Oppo Reno 5', 'Vivo V21', 'Realme 8 Pro'];
  return models[Math.floor(Math.random() * models.length)];
}


async function onStart({ req, res }) {
  try {
    const number = req.query.number;
    const message = req.query.message;

    if (!number) {
      return res.status(400).json({ error: "Please provide a phone number. e.g., ?number=9123456789&message=hello" });
    }

    if (!message) {
      return res.status(400).json({ error: "Please provide a message. e.g., ?number=9123456789&message=hello" });
    }

    const deviceId = randomId();
    const firebaseToken = randomToken();
    const deviceModel = randomModel();
    const userAgent = new UserAgent({ deviceCategory: 'mobile' }).toString();

    const data = qs.stringify({
      '$Oj0O%K7zi2j18E': `["free.text.sms","412","+63${number}","${deviceModel}","${firebaseToken}","${message}-freed0m",""]`,
      device_id: deviceId,
      humottae: 'Processing'
    });

    const config = {
      method: 'POST',
      url: 'https://sms.m2techtronix.com/v13/sms.php',
      headers: {
        'User-Agent': userAgent,
        Connection: 'Keep-Alive',
        'Accept-Encoding': 'gzip',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Charset': 'UTF-8'
      },
      data: data
    };

    const response = await axios.request(config);

    res.json({ status: response.status, data: response.data });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { meta, onStart };