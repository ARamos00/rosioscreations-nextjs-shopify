const crypto = require('crypto');
const fs = require('fs');

const secret = '7e57942497ca7572dfe8ca24f507f3ed0b460795c9d26702cdaaefde3b6c7709'; // Your webhook secret
const payload = fs.readFileSync('C:/Users/black/WebstormProjects/rosioscreations-nextjs-shopify/test-payload.json', 'utf8');

const hmac = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('base64');

console.log('HMAC:', hmac);
