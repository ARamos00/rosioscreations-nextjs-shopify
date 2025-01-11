const crypto = require("crypto");

const SHOPIFY_WEBHOOK_SECRET = "your-shopify-webhook-secret"; // Replace with your actual secret
const payload = JSON.stringify({
    id: 820982911946154500,
    line_items: [
        {
            product_id: 8194931753113,
            properties: [{ name: "Booking Date", value: "2025-01-15" }]
        },
        {
            product_id: 8194941190297,
            properties: [{ name: "Booking Date", value: "2025-01-16" }]
        }
    ]
}); // Replace with your actual payload

const hash = crypto
    .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
    .update(payload, "utf8")
    .digest("base64");

console.log("Calculated HMAC:", hash);
