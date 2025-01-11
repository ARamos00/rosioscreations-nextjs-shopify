import { NextResponse } from 'next/server'; // Next.js response utility
import crypto from 'crypto'; // Node.js module for HMAC signature verification

// Environment variable containing the Shopify webhook secret
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

/**
 * Mock function to update the booking calendar.
 * Replace this with your actual implementation to update the database or system.
 * @param {number} productId - The ID of the product to update.
 * @param {string} date - The date to mark as booked.
 */
const updateBookingCalendar = (productId: number, date: string) => {
    console.log(`Marking product ${productId} as booked on ${date}`);
    // Add your logic here (e.g., update the database with the booking info)
};

/**
 * Handles POST requests for Shopify webhooks.
 * Verifies the webhook signature, processes the payload, and updates the booking calendar.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Response} - JSON response indicating success or failure.
 */
export async function POST(req: Request) {
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256'); // Retrieve the HMAC signature from the headers
    const body = await req.text(); // Get the raw request body as text

    // Verify the HMAC signature using the Shopify webhook secret
    const hash = crypto
        .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET) // Create HMAC with secret
        .update(body, 'utf8') // Add the request body to the HMAC
        .digest('base64'); // Encode the result in Base64

    if (hmacHeader !== hash) {
        // Respond with 401 Unauthorized if the signature doesn't match
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    // Parse the JSON payload from the request body
    const payload = JSON.parse(body);

    // Process each line item in the order
    if (payload.line_items) {
        payload.line_items.forEach((lineItem: any) => {
            const productId = lineItem.product_id; // Extract the product ID
            // Extract the booking date from the line item properties
            const bookingDate = lineItem.properties?.find(
                (prop: any) => prop.name === 'Booking Date'
            )?.value;

            if (bookingDate) {
                // Call the function to update the booking calendar
                updateBookingCalendar(productId, bookingDate);
            }
        });
    }

    // Respond with success once the webhook is processed
    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
}
