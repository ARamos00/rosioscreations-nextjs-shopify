"use client";

import React, { useState, useEffect } from "react"; // Import React and its hooks
import { fetchBookedDates } from "@/lib/bookingHelpers"; // Import helper to fetch booked dates
import { ExtendedProduct } from "@/lib/shopify/extendedTypes"; // Import type for extended product
import CalendarView from "@/components/calendar/CalendarView"; // Import CalendarView component

// Define the props for ServiceCalendar component
interface ServiceCalendarProps {
    product: ExtendedProduct;
}

// ServiceCalendar component displays a calendar for service bookings
const ServiceCalendar: React.FC<ServiceCalendarProps> = ({ product }) => {
    // State to hold the booked dates in "YYYY-MM-DD" format
    const [bookedDates, setBookedDates] = useState<string[]>([]);
    // State to track loading status
    const [loading, setLoading] = useState<boolean>(true);
    // State to store any error messages during fetch
    const [error, setError] = useState<string | null>(null);

    // useEffect hook to fetch booked dates when the component mounts
    useEffect(() => {
        async function getDates() {
            try {
                // Fetch booked dates for service bookings
                const dates = await fetchBookedDates("service");
                setBookedDates(dates);
            } catch (err: any) {
                // Log and set error message in case of failure
                console.error("Error fetching booked dates for service:", err);
                setError(err.message || "Unknown error");
            } finally {
                // Set loading to false after fetch operation is complete
                setLoading(false);
            }
        }
        getDates();
    }, []);

    return (
        <div className="p-4">
            {/* Component heading */}
            <h2 className="text-xl font-semibold mb-4">Service Calendar</h2>
            {loading ? (
                // Display loading message while fetching dates
                <div>Loading booked dates...</div>
            ) : error ? (
                // Display error message if fetching dates fails
                <div>Error: {error}</div>
            ) : (
                // Render CalendarView with fetched booked dates
                <CalendarView bookedDates={bookedDates} />
            )}
        </div>
    );
};

export default ServiceCalendar;
