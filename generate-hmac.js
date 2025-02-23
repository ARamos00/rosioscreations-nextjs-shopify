// generate-hmac.js
const crypto = require("crypto");

// Shopify Webhook Secret (replace with your actual secret)
const SHOPIFY_WEBHOOK_SECRET = "7e57942497ca7572dfe8ca24f507f3ed0b460795c9d26702cdaaefde3b6c7709";

// Sample payload matching our webhook structure
const payload = JSON.stringify({
    id: "12345",
    name: "Test Order",
    email: "test@example.com",
    customer: { id: "67890" },
    line_items: [
        {
            product_id: "8194931753113",
            properties: [{ name: "Booking Date", value: "2025-01-15" }]
        },
        {
            product_id: "8194941190297",
            properties: [{ name: "Booking Date", value: "2025-01-16" }]
        }
    ]
});

// Compute the HMAC digest using the payload and secret
const hash = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(payload, "utf8")
    .digest("base64");

console.log("Calculated HMAC:", hash);
