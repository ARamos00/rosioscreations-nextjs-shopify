// src/app/order-creation/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabaseClient";

const SHOPIFY_WEBHOOK_SECRET = process.env.SHOPIFY_WEBHOOK_SECRET;

export async function POST(req: Request) {
    if (!SHOPIFY_WEBHOOK_SECRET) {
        console.error("Shopify webhook secret is not set.");
        return NextResponse.json(
            { success: false, message: "Server configuration error." },
            { status: 500 }
        );
    }

    if (!supabaseAdmin) {
        console.error("Supabase admin client is not available.");
        return NextResponse.json(
            { success: false, message: "Internal server error." },
            { status: 500 }
        );
    }

    const hmacHeader = req.headers.get("x-shopify-hmac-sha256");
    const body = await req.text();

    const digest = crypto
        .createHmac("sha256", SHOPIFY_WEBHOOK_SECRET)
        .update(body, "utf8")
        .digest("base64");

    if (hmacHeader !== digest) {
        console.error("Webhook signature verification failed.");
        return NextResponse.json(
            { success: false, message: "Unauthorized." },
            { status: 401 }
        );
    }

    try {
        const payload = JSON.parse(body);
        console.log(
            `[Webhook] Order received: ID=${payload.id}, Name=${payload.name}, Email=${payload.email}`
        );

        // Cast order ID to string for consistency.
        const orderId = String(payload.id);
        // Capture Shopify's globally unique order ID if available.
        const orderGid = payload.admin_graphql_api_id || null;

        // Capture order-level customer information.
        const customer = payload.customer || {};
        const customerName =
            customer.first_name && customer.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : customer.name || "Unknown Customer";
        const customerEmail = customer.email || "No Email Provided";

        // Group bookings by normalized booking_date and booking_type.
        const bookingGroups: Record<
            string,
            { bookingDate: string; bookingType: string; count: number }
        > = {};

        const lineItems = payload.line_items;
        for (const item of lineItems) {
            console.log("[Webhook] Line item properties:", item.properties);
            if (item.properties && Array.isArray(item.properties)) {
                // Extract bookingDate property (case-insensitive)
                const bookingDateProp = item.properties.find(
                    (prop: { name: string; value: string }) =>
                        prop.name.trim().toLowerCase() === "bookingdate"
                );
                // Extract bookingType property (case-insensitive)
                const bookingTypeProp = item.properties.find(
                    (prop: { name: string; value: string }) =>
                        prop.name.trim().toLowerCase() === "bookingtype"
                );
                if (bookingDateProp && bookingDateProp.value) {
                    // Normalize booking date to YYYY-MM-DD
                    let booking_date = bookingDateProp.value;
                    if (booking_date.includes("T")) {
                        booking_date = booking_date.split("T")[0];
                    }
                    // Use provided bookingType or default to "event_decor"
                    const booking_type =
                        bookingTypeProp && bookingTypeProp.value
                            ? bookingTypeProp.value
                            : "event_decor";
                    // Build the grouping key.
                    const key = `${booking_date}_${booking_type}`;
                    if (bookingGroups[key]) {
                        bookingGroups[key].count += 1;
                    } else {
                        bookingGroups[key] = {
                            bookingDate: booking_date,
                            bookingType: booking_type,
                            count: 1,
                        };
                    }
                }
            }
        }

        // Process each booking group.
        for (const key in bookingGroups) {
            const group = bookingGroups[key];
            console.log(
                `[Webhook] Grouped Booking: Date=${group.bookingDate}, Type=${group.bookingType}, Count=${group.count}, OrderID=${orderId}, Customer=${customerName}, Email=${customerEmail}`
            );

            // Check if a booking already exists for this order, date, and type.
            const { data: existingBooking, error: selectError } = await supabaseAdmin
                .from("bookings")
                .select("*")
                .eq("order_id", orderId)
                .eq("booking_type", group.bookingType)
                .eq("booking_date", group.bookingDate)
                .maybeSingle();

            if (selectError) {
                console.error(
                    `[Webhook] Error checking booking for ${group.bookingDate} (type: ${group.bookingType}):`,
                    selectError
                );
                continue;
            }

            if (existingBooking) {
                console.log(
                    `[Webhook] Booking already exists for ${group.bookingDate} with type ${group.bookingType} in order ${orderId}.`
                );
            } else {
                // Create the booking record in Supabase.
                const { data: newBooking, error: insertError } = await supabaseAdmin
                    .from("bookings")
                    .insert([
                        {
                            order_id: orderId,
                            order_gid: orderGid, // Store Shopify order GID for future matching.
                            customer_name: customerName,
                            customer_email: customerEmail,
                            booking_date: group.bookingDate,
                            booking_type: group.bookingType,
                            items_count: group.count,
                        },
                    ])
                    .maybeSingle();

                if (insertError) {
                    console.error(
                        `[Webhook] Error creating booking for ${group.bookingDate} with type ${group.bookingType}:`,
                        insertError
                    );
                } else {
                    console.log(
                        `[Webhook] Booking created successfully for ${group.bookingDate} with type ${group.bookingType}:`,
                        newBooking
                    );
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
