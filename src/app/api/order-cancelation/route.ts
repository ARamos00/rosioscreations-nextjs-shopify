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

    // Verify the webhook signature.
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
            `[Webhook Cancel] Order cancellation received: ID=${payload.id}, GID=${payload.admin_graphql_api_id}, Name=${payload.name}, Email=${payload.email}`
        );

        // Convert order ID to string for consistency.
        const orderId = String(payload.id);
        // Capture Shopify's globally unique order ID if available.
        const orderGid = payload.admin_graphql_api_id ? String(payload.admin_graphql_api_id) : null;
        const cancelReason = payload.cancel_reason;
        const cancelledAt = payload.cancelled_at;

        // Extract customer information.
        const customer = payload.customer || {};
        const customerName =
            customer.first_name && customer.last_name
                ? `${customer.first_name} ${customer.last_name}`
                : customer.name || "Unknown Customer";

        console.log(
            `[Webhook Cancel] Cancelling bookings for OrderID=${orderId}, OrderGID=${orderGid}, Customer=${customerName}, Reason=${cancelReason}, Cancelled At=${cancelledAt}`
        );

        // Delete booking records using the order GID if available, otherwise fallback to order ID.
        let deleteQuery = supabaseAdmin.from("bookings").delete();
        if (orderGid) {
            deleteQuery = deleteQuery.eq("order_gid", orderGid);
        } else {
            deleteQuery = deleteQuery.eq("order_id", orderId);
        }

        const { error } = await deleteQuery;
        if (error) {
            console.error(
                `[Webhook Cancel] Error deleting bookings for order ${orderId}:`,
                error
            );
            return NextResponse.json(
                { success: false, message: "Error deleting booking records." },
                { status: 500 }
            );
        }

        console.log(`[Webhook Cancel] Bookings successfully removed for OrderID=${orderId}`);
        return NextResponse.json({
            success: true,
            message: "Order cancellation processed successfully.",
        });
    } catch (error) {
        console.error("Error processing cancellation webhook:", error);
        return NextResponse.json(
            {
                success: false,
                message: "Error processing cancellation webhook.",
                error: error instanceof Error ? error.message : "Unknown error",
            },
            { status: 500 }
        );
    }
}
