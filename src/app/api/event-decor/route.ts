// src/app/api/event-decor/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseClient";

/**
 * GET /api/event-decor?date=YYYY-MM-DD (optional)
 * - If a date is provided, fetch event decor bookings for that date.
 * - Otherwise, fetch all event decor bookings.
 */
export async function GET(req: Request) {
    // Ensure supabaseAdmin is not null
    if (!supabaseAdmin) {
        console.error("Supabase admin client is not available.");
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const date = searchParams.get("date");

    try {
        let bookingsResponse;
        if (date) {
            console.log(`[GET] Fetching bookings for date: ${date}`);
            bookingsResponse = await supabaseAdmin
                .from("bookings")
                .select("*")
                .eq("booking_type", "event_decor")
                .eq("booking_date", date);
        } else {
            console.log("[GET] Fetching all event decor bookings");
            bookingsResponse = await supabaseAdmin
                .from("bookings")
                .select("*")
                .eq("booking_type", "event_decor");
        }

        const { data: bookings, error } = bookingsResponse;
        if (error) throw error;

        return NextResponse.json({ bookings });
    } catch (error) {
        console.error("Error fetching event decor bookings:", error);
        return NextResponse.json({ message: "Error fetching bookings" }, { status: 500 });
    }
}

/**
 * POST /api/event-decor
 * Create a new event decor booking.
 * Expects JSON: { booking_date: "YYYY-MM-DD", customer_id: number }
 */
export async function POST(req: Request) {
    if (!supabaseAdmin) {
        console.error("Supabase admin client is not available.");
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }

    try {
        const { booking_date, customer_id } = await req.json();

        if (!booking_date || !customer_id) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Check if there's an existing event decor booking for the date
        const { data: existingBooking, error: selectError } = await supabaseAdmin
            .from("bookings")
            .select("*")
            .eq("booking_type", "event_decor")
            .eq("booking_date", booking_date)
            .maybeSingle();

        if (selectError) throw selectError;

        if (existingBooking) {
            return NextResponse.json(
                { message: "Event decor booking already exists for this date" },
                { status: 400 }
            );
        }

        // Create the booking
        const { data: newBooking, error: insertError } = await supabaseAdmin
            .from("bookings")
            .insert([{ booking_date, customer_id, booking_type: "event_decor" }])
            .maybeSingle();

        if (insertError) {
            console.error("Insert error", insertError);
            return NextResponse.json(
                { message: "Error creating booking" },
                { status: 500 }
            );
        }

        return NextResponse.json({
            message: "Booking created successfully",
            booking: newBooking,
        });
    } catch (error) {
        console.error("Error processing request", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
