"use client";

import React, { useState, useEffect } from "react";
import { fetchBookedDates } from "@/lib/bookingHelpers";
import { ExtendedProduct } from "@/lib/shopify/extendedTypes";
import CalendarView from "@/components/calendar/CalendarView";

// Define the props for the EventRentalCalendar component
interface EventRentalCalendarProps {
    product: ExtendedProduct;
}

// Component for displaying the event rental calendar
const EventRentalCalendar: React.FC<EventRentalCalendarProps> = ({ product }) => {
    // State to store booked dates as an array of strings
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    // State to manage loading state while fetching data
    const [loading, setLoading] = useState<boolean>(true);
    // State to capture any error messages during the fetch operation
    const [error, setError] = useState<string | null>(null);

    // useEffect hook to fetch booked dates when the component mounts
    useEffect(() => {
        async function getDates() {
            try {
                // Fetch booked dates for event bookings
                const dates = await fetchBookedDates("event");
                setBookedDates(dates);
            } catch (err: any) {
                // Log and set error state if fetching fails
                console.error("Error fetching booked dates for event rental:", err);
                setError(err.message || "Unknown error");
            } finally {
                // Set loading state to false after the fetch operation completes
                setLoading(false);
            }
        }
        getDates();
    }, []);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Event Rental Calendar</h2>
            {loading ? (
                // Render loading message while data is being fetched
                <div>Loading booked dates...</div>
            ) : error ? (
                // Render error message if fetching booked dates fails
                <div>Error: {error}</div>
            ) : (
                // Render CalendarView component with the fetched booked dates
                <CalendarView bookedDates={bookedDates} />
            )}
        </div>
    );
};

export default EventRentalCalendar;
