import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET!;

// Function to add booking to Supabase
const saveBooking = async (productId: number, bookingDate: string) => {
    const { data, error } = await supabase.from('bookings').insert([
        { product_id: productId, booking_date: bookingDate },
    ]);

    if (error) {
        console.error('Error saving booking:', error.message);
        throw new Error('Failed to save booking');
    }

    console.log('Booking saved:', data);
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

    // Process the payload
    if (payload.line_items) {
        for (const lineItem of payload.line_items) {
            const productId = lineItem.product_id;
            const bookingDate = lineItem.properties?.find((prop: any) => prop.name === 'Booking Date')?.value;

            if (bookingDate) {
                try {
                    await saveBooking(productId, bookingDate);
                } catch (error) {
                    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
                }
            }
        }
    }

    return NextResponse.json({ success: true, message: 'Webhook processed successfully' });
}
