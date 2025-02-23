// src/app/shopify-webhook/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

/**
 * POST /api/webhooks/order-created
 *
 * This endpoint handles Shopify order creation webhooks.
 * It verifies the HMAC signature, logs order details, and creates
 * an event decor booking if a line item includes a "Booking Date" property.
 */
export async function POST(req: Request) {
    // Validate that the Shopify webhook secret is configured.
    if (!SHOPIFY_WEBHOOK_SECRET) {
        console.error("Shopify webhook secret is not set.");
        return NextResponse.json(
            { success: false, message: "Server configuration error." },
            { status: 500 }
        );
    }

    // Ensure supabaseAdmin is available.
    if (!supabaseAdmin) {
        console.error("Supabase admin client is not available.");
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }

    // Retrieve the HMAC signature from the headers.
    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const body = await req.text();

    // Compute the HMAC digest using the webhook secret.
    const digest = crypto
        .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
        .update(body, "utf8")
        .digest("base64");

    // Validate the computed digest against the header.
    if (hmacHeader !== digest) {
        console.error("Webhook signature verification failed.");
        return NextResponse.json(
            { success: false, message: "Unauthorized." },
            { status: 401 }
        );
    }

    try {
        // Parse the order payload.
        const payload = JSON.parse(body);

        // Log basic order details.
        console.log(
            `[Webhook] Order received: ID=${payload.id}, Name=${payload.name}, Email=${payload.email}`
        );

        // Process each line item to check for booking date properties.
        const lineItems = payload.line_items;
        for (const item of lineItems) {
            if (item.properties && Array.isArray(item.properties)) {
                // Look for a property named "Booking Date".
                const bookingDateProp = item.properties.find(
                    (prop: { name: string; value: string }) => prop.name === "Booking Date"
                );
                if (bookingDateProp && bookingDateProp.value) {
                    const booking_date = bookingDateProp.value; // Expected to be in YYYY-MM-DD format.
                    // Use the Shopify customer ID if available, otherwise default to 0.
                    const customer_id = payload.customer?.id || 0;

                    console.log(
                        `[Webhook] Found booking date: ${booking_date} for customer: ${customer_id}`
                    );

                    // Check if a booking already exists for this date.
                    const { data: existingBooking, error: selectError } = await supabaseAdmin
                        .from("bookings")
                        .select("*")
                        .eq("booking_type", "event_decor")
                        .eq("booking_date", booking_date)
                        .maybeSingle();

                    if (selectError) {
                        console.error(
                            `[Webhook] Error checking booking for ${booking_date}:`,
                            selectError
                        );
                        continue;
                    }

                    if (existingBooking) {
                        console.log(`[Webhook] Booking already exists for ${booking_date}.`);
                    } else {
                        // Create the booking.
                        const { data: newBooking, error: insertError } = await supabaseAdmin
                            .from("bookings")
                            .insert([{ booking_date, customer_id, booking_type: "event_decor" }])
                            .maybeSingle();

                        if (insertError) {
                            console.error(
                                `[Webhook] Error creating booking for ${booking_date}:`,
                                insertError
                            );
                        } else {
                            console.log(
                                `[Webhook] Booking created successfully for ${booking_date}:`,
                                newBooking
                            );
                        }
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order webhook processed successfully.",
        });
    } catch (error) {
        console.error("Error processing webhook:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error processing webhook.",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
