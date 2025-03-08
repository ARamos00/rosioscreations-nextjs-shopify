import { supabase } from "@/lib/supabaseClient";

export async function fetchBookedDates(
    calendarType: "event" | "service"
): Promise<string[]> {
    // Query the unified "bookings" table.
    let query = supabase.from("bookings").select("booking_date");

    // Filter based on calendar type.
    if (calendarType === "service") {
        query = query.eq("booking_type", "Service");
    } else if (calendarType === "event") {
        // Adjust these values to match your event booking types.
        query = query.in("booking_type", ["Event Rental", "Event", "Rental"]);
    }

    const { data, error } = await query;

    if (error) {
        console.error("Error fetching booked dates from bookings table:", error);
        throw new Error(error.message);
    }

    // Return an array of booked dates as strings.
    return data.map((row: { booking_date: string }) => row.booking_date);
}
