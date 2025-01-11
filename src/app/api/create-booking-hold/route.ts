import { NextResponse } from 'next/server';
import crypto from 'crypto';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

// Mock function to update the booking calendar
const updateBookingCalendar = (productId: number, date: string) => {
    console.log(`Marking product ${productId} as booked on ${date}`);
    // Add your logic to update the booking calendar (e.g., database update)
};

export async function POST(req: Request) {
    const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
    const body = await req.text();

    // Verify the HMAC signature
    const hash = crypto
        .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
        .update(body, 'utf8')
        .digest('base64');

    if (hmacHeader !== hash) {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
    }

    const payload = JSON.parse(body);

    // Process the order
    if (payload.line_items) {
        payload.line_items.forEach((lineItem: any) => {
            const productId = lineItem.product_id;
            const bookingDate = lineItem.properties?.find((prop: any) => prop.name === 'Booking Date')?.value;

            if (bookingDate) {
                updateBookingCalendar(productId, bookingDate);
            }
        });
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
}
