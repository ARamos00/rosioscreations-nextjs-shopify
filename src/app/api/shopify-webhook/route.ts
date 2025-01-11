import { NextResponse } from "next/server"; // Next.js response utility
import crypto from "crypto"; // Node.js crypto module for HMAC verification
import { saveBooking } from "@/lib/bookingQueries"; // Import the saveBooking function

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

// Define the type for Shopify line items
interface LineItem {
    product_id: number;
    properties?: Array<{ name: string; value: string }>;
}

/**
 * Handles POST requests for Shopify webhooks.
 * Verifies the webhook signature, processes the payload, and saves booking details.
 */
export async function POST(req: Request) {
    if (!SHOPIFY_WEBHOOK_SECRET) {
        console.error("Shopify webhook secret is not set in environment variables.");
        return NextResponse.json(
            { success: false, message: "Server configuration error" },
            { status: 500 }
        );
    }

    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const body = await req.text();

    // Verify the HMAC signature
    const hash = crypto
        .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
        .update(body, "utf8")
        .digest("base64");

    if (hmacHeader !== hash) {
        console.error("HMAC verification failed.");
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    try {
        const payload = JSON.parse(body);

        if (!payload.line_items || !Array.isArray(payload.line_items)) {
            console.error("No line items found in webhook payload.");
            return NextResponse.json(
                { success: false, message: "Invalid payload structure: Missing line_items" },
                { status: 400 }
            );
        }

        // Process each line item
        const bookingPromises = payload.line_items.map(async (lineItem: LineItem) => {
            const productId = lineItem.product_id;
            const bookingDate = lineItem.properties?.find(
                (prop) => prop.name === "Booking Date"
            )?.value;

            if (bookingDate) {
                try {
                    await saveBooking(productId, bookingDate);
                    console.log(`Booking saved: Product ID - ${productId}, Date - ${bookingDate}`);
                } catch (error) {
                    console.error(`Failed to save booking for Product ID - ${productId}, Date - ${bookingDate}:`, error);
                }
            } else {
                console.warn(`No booking date found for Product ID - ${productId}.`);
            }
        });

        await Promise.all(bookingPromises);

        return NextResponse.json({ success: true, message: "Webhook processed successfully" });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error processing webhook",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
