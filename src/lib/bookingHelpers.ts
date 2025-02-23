import { supabase } from "@/lib/supabaseClient";

export async function fetchBookedDates(
    calendarType: "event" | "service"
): Promise<string[]> {
    const tableName =
        calendarType === "event" ? "event_rental_bookings" : "service_bookings";

    const { data, error } = await supabase
        .from(tableName)
        .select("booked_date");

    if (error) {
        console.error(`Error fetching booked dates from ${tableName}:`, error);
        throw new Error(error.message);
    }

    return data.map((row: { booked_date: string }) => row.booked_date);
}
