import { NextResponse } from 'next/server'; // Next.js response utility
import crypto from 'crypto'; // Node.js crypto module for HMAC verification
import { saveBooking } from '@/lib/bookingQueries'; // Import the saveBooking function

// Shopify webhook secret (set in your environment variables)
const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/**
 * Handles POST requests for Shopify webhooks.
 * Verifies the webhook signature, processes the payload, and saves booking details.
 * @param {Request} req - The incoming HTTP request.
 * @returns {Response} - JSON response indicating success or failure.
 */
export async function POST(req: Request) {
    if (!SHOPIFY_WEBHOOK_SECRET) {
        console.error('Shopify webhook secret is not set in environment variables.');
        return NextResponse.json({ success: false, message: 'Server configuration error' }, { status: 500 });
    }

    const hmacHeader = req.headers.get('x-shopify-hmac-sha256'); // Retrieve HMAC signature from the request headers
    const body = await req.text(); // Retrieve raw request body

    // Verify the HMAC signature using the Shopify webhook secret
    const hash = crypto
        .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET) // Create HMAC with secret
        .update(body, 'utf8') // Update HMAC with request body
        .digest('base64'); // Encode the result in Base64

    if (hmacHeader !== hash) {
        console.error('HMAC verification failed.');
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const payload = JSON.parse(body); // Parse the JSON payload from the request body

        // Process the line items in the webhook payload
        if (payload.line_items) {
            for (const lineItem of payload.line_items) {
                const productId = lineItem.product_id; // Extract the product ID from the line item
                const bookingDate = lineItem.properties?.find(
                    (prop: any) => prop.name === 'Booking Date' // Find the booking date property
                )?.value;

                if (bookingDate) {
                    await saveBooking(productId, bookingDate); // Save booking to the database
                }
            }
        }

        // Return 200 OK if the webhook is processed successfully
        return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
    } catch (error) {
        console.error('Error processing webhook:', error); // Log the error
        return NextResponse.json(
            { success: false, message: 'Error processing webhook', error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
